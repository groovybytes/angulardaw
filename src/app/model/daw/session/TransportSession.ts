import {BehaviorSubject, Subscription} from "rxjs";
import {Scheduler} from "./Scheduler";
import {Thread} from "../Thread";
import {Sample} from "../Sample";
import {EventEmitter} from "@angular/core";
import {DawEvent} from "../DawEvent";
import {DawEventCategory} from "../DawEventCategory";
import {Pattern} from "../Pattern";
import * as _ from "lodash";

export class TransportSession {

  private scheduler: Scheduler;
  private stopEvent: EventEmitter<void> = new EventEmitter();
  readonly running: BehaviorSubject<boolean>=new BehaviorSubject(false);
  private playSubscription: Subscription;

  constructor(
    private dawEvents: EventEmitter<DawEvent<any>>,
    private ticker: Thread,
    private getNoteInterval: (note1: string, note2: string) => number,
    private sampleGetter: (targetId: string,note:string) => Sample,
    private audioContext: AudioContext,
    bpm: BehaviorSubject<number>) {

    this.scheduler = new Scheduler(dawEvents, this.audioContext, bpm, this.ticker);

  }

  start(patterns: Array<Pattern>,loop:boolean,loopLenth?:number): void {


    if (this.running.getValue()) this.stop();
    else{
      this.running.next(true);
      this.playSubscription = this.scheduler.playEvent
        .subscribe((event: { note: string, time: number, length: number,target:string }) => {
          patterns.find(pattern=>pattern.id===event.target).plugin.play(event.note, event.time, event.length,this.stopEvent);
          this.dawEvents.emit(new DawEvent(DawEventCategory.TRANSPORT_NOTE_QUEUED, event));
        });

      let events = [];
      patterns.forEach(pattern=>{
        pattern.events.forEach(event=>{
          events.push({event:event,target:pattern.id});
        })
      });

      events=_.sortBy(events, event=>event.event.time);

      this.scheduler.run(events,loop,loopLenth);
    }


  }

  stop(): void {
    this.running.next(false);
    this.stopEvent.emit();
    this.playSubscription.unsubscribe();
    this.scheduler.stop();

    this.dawEvents.emit(new DawEvent(DawEventCategory.TRANSPORT_STOP));
  }

  /*private play(note: string, time: number, length: number,targetId:string): void {


    let detune = 0;
    let node: AudioBufferSourceNode;
    let sample = this.sampleGetter(targetId,note);
    if (sample.baseNote) detune = this.getNoteInterval(sample.baseNote.id, note);
    sample.trigger(time, length, null, detune)
      .then(_node => {
        node = _node;
        node.addEventListener("ended", () => {
          node=null;
        });
      });

    let stopSubscription = this.stopEvent.subscribe(() => {
      stopSubscription.unsubscribe();
      if (node) {
        node.stop(0);
        node.disconnect();
        node=null;
      }
    });

  }*/


}


