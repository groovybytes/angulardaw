import {NoteEvent} from "../../mip/NoteEvent";
import {MusicMath} from "../../utils/MusicMath";
import {NoteLength} from "../../mip/NoteLength";
import {BehaviorSubject, Subscription} from "rxjs";
import {Thread} from "../Thread";
import {EventEmitter} from "@angular/core";
import {DawEvent} from "../DawEvent";
import {DawEventCategory} from "../DawEventCategory";


export class Scheduler {

  playEvent: EventEmitter<{ note: string, time: number, length: number,target:string }> = new EventEmitter();
  private running: boolean = false;

  private subscriptions: Array<Subscription> = [];

  constructor(private events: EventEmitter<DawEvent<any>>,
              private audioContext: AudioContext,
              private bpm: BehaviorSubject<number>,
              private ticker: Thread) {
  }


  run(events: Array<{event:NoteEvent,target:string}>, loop?: boolean, loopLength?: number): void {

    if (this.running) return;

    this.running = true;
    let position = 0;
    let lookAhead = 2;//seconds
    let startTime;
    let currentLoop = 0;

    this.ticker.post(
      {
        command: "set-interval"
        , params: MusicMath.getTickTime(this.bpm.getValue(), NoteLength.Quarter)
      });

    let nextTick = (tick: number) => {
      if (position < events.length) {

        let frameStart = this.audioContext.currentTime;
        let frameEnd = frameStart + lookAhead;
        let inFrame = (time) => time >= frameStart && time <= frameEnd;
        let getTriggerTime = (event: NoteEvent) => (startTime ? startTime : frameStart) + event.time / 1000 * bpmFactor + (loopLength * bpmFactor * currentLoop);

        let bpmFactor = 120 / this.bpm.getValue();
        let exit = false;
        while (!exit && inFrame(getTriggerTime(events[position].event))) {
          if (!startTime) startTime = this.audioContext.currentTime;
          let triggerTime = getTriggerTime(events[position].event);
          this.playEvent.emit({
            note: events[position].event.note,
            time: triggerTime,
            length: events[position].event.length * bpmFactor,
            target:events[position].target
          });
          position++;
          if (position === events.length) {
            if (loop) {
              position = 0;
              currentLoop += 1;
            } else exit = true;
          }
        }

      }
    };

    this.subscriptions.push(this.ticker.error.subscribe(error => console.error(error)));
    this.subscriptions.push(this.ticker.message.subscribe(msg => {
      if (msg.data.hint === "tick") {

        nextTick(msg.data.value);
        this.events.emit(new DawEvent(DawEventCategory.TICK, msg.data.value));
      }
      if (msg.data.hint === "start") {

        //this.events.emit(new DawEvent(DawEventCategory.TICK, 0));

      }
      if (msg.data.hint === "stop") {

        startTime=null;

      }
    }));

    this.ticker.post({command: "start"});

  }

  private nextTick(): void {

  }

  stop(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.ticker.post({command: "stop"});
    this.running = false;
  }

}
