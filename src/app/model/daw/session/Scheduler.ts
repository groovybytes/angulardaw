import {MusicMath} from "../../utils/MusicMath";
import {NoteLength} from "../../mip/NoteLength";
import {BehaviorSubject, Subscription} from "rxjs";
import {Thread} from "../Thread";
import {EventEmitter} from "@angular/core";
import {DawEvent} from "../DawEvent";
import {DawEventCategory} from "../DawEventCategory";
import {SchedulerEvent} from "./SchedulerEvent";
import * as _ from "lodash";


export class Scheduler {

  playEvent: EventEmitter<SchedulerEvent> = new EventEmitter();
  startEvent: EventEmitter<number> = new EventEmitter();
  private running: boolean = false;
  private startTime: number;
  private currentLoop: number = 0;
  private schedulerEvents: Array<SchedulerEvent>;

  private subscriptions: Array<Subscription> = [];

  constructor(private events: EventEmitter<DawEvent<any>>,
              private audioContext: AudioContext,
              private bpm: BehaviorSubject<number>,
              private ticker: Thread) {
  }


  run(events: Array<SchedulerEvent>, countIn: number, loop?: boolean, loopLength?: number): void {


    if (this.running) return;
    this.schedulerEvents = events;
    this.running = true;
    let position = 0;
    let countingIn = countIn > 0;
    let lookAhead = 2;//seconds


    this.ticker.post(
      {
        command: "set-interval"
        , params: MusicMath.getTickTime(this.bpm.getValue(), NoteLength.Quarter)
      });

    let nextTick = (tick: number) => {

      /*   if (loop && this.startTime) {
           currentLoop=Math.floor((this.audioContext.currentTime-this.startTime) / loopLength);
         }
   */

      if (position < events.length) {

        let frameStart = this.audioContext.currentTime;
        let frameEnd = frameStart + lookAhead;
        let inFrame = (time) => time >= frameStart && time <= frameEnd;

        let getTriggerTime = (time: number) => MusicMath.getNoteEventTriggerTime(
          this.startTime ? this.startTime : frameStart, time, loopLength, this.currentLoop, this.bpm.getValue());

        let bpmFactor = 120 / this.bpm.getValue();
        let exit = false;

        while (!exit && inFrame(getTriggerTime(events[position].time) + events[position].offset)) {

          if (!this.startTime) {
            this.startTime = this.audioContext.currentTime;
            this.startEvent.emit(this.startTime);
          }
          let triggerTime = getTriggerTime(events[position].time) + events[position].offset;
          this.playEvent.emit(new SchedulerEvent(events[position].note, events[position].id,
            triggerTime,
            events[position].target, 0, events[position].length * bpmFactor));

          position++;
          if (position === events.length) {
            if (loop) {
              position = 0;
              this.currentLoop++;
            } else exit = true;
          }
        }

      } else {
        //this happens if there are no events
        if (!this.startTime) {
          this.startTime = this.audioContext.currentTime;
          this.startEvent.emit(this.startTime);
        }
      }
    };

    this.subscriptions.push(this.ticker.error.subscribe(error => console.error(error)));
    this.subscriptions.push(this.ticker.message.subscribe(msg => {
      if (msg.data.hint === "tick") {
        let tick = msg.data.value;
        if (!countingIn) {
          nextTick(msg.data.value);
        }
        this.events.emit(new DawEvent(DawEventCategory.TICK, {tick: tick, countIn: countingIn}));

        if (countingIn && tick+1 === countIn) {
          countingIn = false;
          this.ticker.post({command: "reset"});
        }


      }
      if (msg.data.hint === "start") {

        //this.events.emit(new DawEvent(DawEventCategory.TICK, 0));

      }
      if (msg.data.hint === "stop") {

        this.startTime = null;

      }
    }));

    this.ticker.post({command: "start"});

  }

  addEvent(event: SchedulerEvent, loopLength: number): void {
    let sortedIndex = _.sortedIndexBy(this.schedulerEvents, {"time": event.time}, (event) => event.time);
    if (this.schedulerEvents.length === 0) {
      this.currentLoop = Math.floor((this.audioContext.currentTime - this.startTime) / loopLength) + 1;
    }
    this.schedulerEvents.splice(sortedIndex, 0, event);

  }

  removeEventsWithTarget(target: string): void {
    _.remove(this.schedulerEvents, event => event.target === target);

  }

  updateEventLength(eventId: string, length: number): void {
    let event = this.schedulerEvents.find(event => event.id === eventId);
    if (event) event.length = length;
    else console.warn("event not found");
  }

  stop(): void {
    this.currentLoop = 0;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.ticker.post({command: "stop"});
    this.running = false;
  }

}
