import {BehaviorSubject, Subscription} from "rxjs";
import {Scheduler} from "./Scheduler";
import {Thread} from "../Thread";
import {Sample} from "../Sample";
import {EventEmitter} from "@angular/core";
import {DawEvent} from "../DawEvent";
import {DawEventCategory} from "../DawEventCategory";
import {Pattern} from "../Pattern";
import * as _ from "lodash";
import {MetronomeSettings} from "../MetronomeSettings";
import {filter} from "rxjs/operators";
import {MusicMath} from "../../utils/MusicMath";
import {RecordSession} from "../RecordSession";

export class TransportSession {

  private scheduler: Scheduler;
  private stopEvent: EventEmitter<void> = new EventEmitter();
  readonly running: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private playSubscription: Subscription;
  private metronomeSettingsSubscription: Subscription;
  private tickerSubscription: Subscription;
  private startEventSubscription: Subscription;

  constructor(
    private dawEvents: EventEmitter<DawEvent<any>>,
    private recordSession: RecordSession,
    private ticker: Thread,
    private getNoteInterval: (note1: string, note2: string) => number,
    private sampleGetter: (targetId: string, note: string) => Sample,
    private audioContext: AudioContext,
    private bpm: BehaviorSubject<number>) {

    this.scheduler = new Scheduler(dawEvents, this.audioContext, bpm, this.ticker);

  }

  //returns event which provides starting time
  start(patterns: Array<Pattern>, loop: boolean, loopLength: number,
        metronomeSettings: MetronomeSettings): void {
    // metronomeSettings.pattern.plugin.play("A0",0,0.5,null);
    if (this.running.getValue()) this.stop();
    else {
      this.running.next(true);

      this.tickerSubscription = this.dawEvents.pipe(filter((event => event.category === DawEventCategory.TICK))).subscribe(tickerEvent => {
        metronomeSettings.pattern.plugin.play("A0", 0, 0.5, null);
      });
      this.metronomeSettingsSubscription = metronomeSettings.enabled.subscribe(enabled => {

      });

      let countInOffset = 0;//MusicMath.getLoopLength(metronomeSettings.pattern.length,this.bpm.getValue());
      this.playSubscription = this.scheduler.playEvent
        .subscribe((event: { note: string, time: number, length: number, target: string }) => {
          patterns.find(pattern => pattern.id === event.target).plugin.play(event.note, event.time, event.length, this.stopEvent);
          this.dawEvents.emit(new DawEvent(DawEventCategory.TRANSPORT_NOTE_QUEUED, event));
        });

      let events = [];
      patterns.forEach(pattern => {
        pattern.events.forEach(event => {
          events.push({event: event, target: pattern.id, offset: countInOffset});
        })
      });

      /* if (metronomeSettings.enabled.getValue()===true){
         metronomeSettings.pattern.events.forEach(event=>{
           events.push({event:event,target:metronomeSettings.pattern.id,offset:0});
         })
       }*/

      //patterns.push(metronomeSettings.pattern);

      if (this.recordSession.state.getValue() === 1) {
        this.startEventSubscription = this.scheduler.startEvent.subscribe((startTime) => {
          this.recordSession.startTime = startTime;
          this.recordSession.state.next(2);
        })
      }
      events = _.sortBy(events, event => event.event.time);
      this.scheduler.run(events, loop, loopLength);

    }

  }

  stop(): void {
    this.running.next(false);
    this.stopEvent.emit();
    this.metronomeSettingsSubscription.unsubscribe();
    this.playSubscription.unsubscribe();
    this.tickerSubscription.unsubscribe();
    if (this.startEventSubscription) this.startEventSubscription.unsubscribe();
    this.scheduler.stop();
    if (this.recordSession.state.getValue() === 2) this.recordSession.state.next(0);
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


