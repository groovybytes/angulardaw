import {MusicMath} from "../../utils/MusicMath";
import {NoteLength} from "../../mip/NoteLength";
import {BehaviorSubject, Subscription} from "rxjs";
import {Thread} from "../Thread";
import {EventEmitter} from "@angular/core";
import {DawEvent} from "../DawEvent";
import {DawEventCategory} from "../DawEventCategory";
import * as _ from "lodash";
import {NoteEvent} from "../../mip/NoteEvent";


export class Scheduler {

  playEvent: EventEmitter<NoteEvent> = new EventEmitter();
  startEvent: EventEmitter<number> = new EventEmitter();
  private running: boolean = false;
  private startTime: number;
  private currentLoop: number = 0;
  private NoteEvents: Array<NoteEvent>;
  private events: EventEmitter<DawEvent<any>>;
  private bpm: BehaviorSubject<number>;
  private ticker: Thread;

  private subscriptions: Array<Subscription> = [];

  constructor(private audioContext: AudioContext) {
  }

  init(events: EventEmitter<DawEvent<any>>, bpm: BehaviorSubject<number>, ticker: Thread): void {
    this.events = events;
    this.bpm = bpm;
    this.ticker = ticker;
  }


  run(events: Array<NoteEvent>, countIn: number, loop?: boolean, loopLength?: number): void {


    if (this.running) return;
    this.NoteEvents = events;
    this.running = true;
    let position = 0;
    let countingIn = countIn > 0;
    let lookAhead = 2;//seconds

    let countInOffset =MusicMath.getTimeAtBeat(countIn, this.bpm.getValue(), NoteLength.Quarter);

    this.ticker.post(
      {
        command: "set-interval"
        , params: MusicMath.getTickTime(this.bpm.getValue(), NoteLength.Quarter)
      });

    let nextTick = () => {


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

          let clonedEvent = NoteEvent.clone(events[position]);
          clonedEvent.time = getTriggerTime(clonedEvent.time) + clonedEvent.offset;
          if (clonedEvent.target !== "_metronome-pattern") clonedEvent.time+=countInOffset/1000;
          NoteEvent.updateLength(clonedEvent, clonedEvent.length * bpmFactor);
          this.playEvent.emit(clonedEvent);


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
        if (!this.startTime && !countingIn) {
          this.startTime = this.audioContext.currentTime;
          this.startEvent.emit(this.startTime);
        }
      }
    };

    this.subscriptions.push(this.ticker.error.subscribe(error => console.error(error)));
    this.subscriptions.push(this.ticker.message.subscribe(msg => {
      if (msg.data.hint === "tick") {
        let tick = msg.data.value;
        nextTick();
        countingIn=(countIn===0|| tick < countIn+1);
        this.events.emit(new DawEvent(DawEventCategory.TICK, {tick: tick,countInOffset:countIn, countIn: tick < countIn}));

      }
      if (msg.data.hint === "start") {

      }
      if (msg.data.hint === "stop") {

        this.startTime = null;

      }
    }));

    this.ticker.post({command: "start"});

  }

  addEvent(event: NoteEvent, loopLength: number): void {
    let sortedIndex = _.sortedIndexBy(this.NoteEvents, {"time": event.time}, (event) => event.time);
    if (this.NoteEvents.length === 0) {
      this.currentLoop = Math.floor((this.audioContext.currentTime - this.startTime) / loopLength) + 1;
    }
    this.NoteEvents.splice(sortedIndex, 0, event);

  }

  removeEventsWithTarget(target: string): void {
    _.remove(this.NoteEvents, event => event.target === target);

  }

  updateEventLength(eventId: string, length: number): void {
    let event = this.NoteEvents.find(event => event.id === eventId);
    if (event) event.length = length;
    else console.warn("event not found");
  }

  stop(): void {
    this.currentLoop = 0;
    this.startTime = null;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.ticker.post({command: "stop"});
    this.running = false;
  }

}
