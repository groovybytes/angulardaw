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
import {SchedulerEvent} from "./SchedulerEvent";
import {NoteEvent} from "../../mip/NoteEvent";

export class TransportSession {

  private scheduler: Scheduler;
  private stopEvent: EventEmitter<void> = new EventEmitter();
  readonly running: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private playSubscription: Subscription;
  private metronomeSettingsSubscription: Subscription;
  private tickerSubscription: Subscription;
  private startEventSubscription: Subscription;
  private patternSubscriptions: Array<Subscription>=[];

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
  start(patterns: Array<Pattern>,countIn:number, loop: boolean, loopLength: number,
        metronomeSettings: MetronomeSettings): void {
    // metronomeSettings.pattern.plugin.play("A0",0,0.5,null);
    if (this.running.getValue()) this.stop();
    else {
      this.running.next(true);

     /* this.tickerSubscription = this.dawEvents.pipe(filter((event => event.category === DawEventCategory.TICK))).subscribe(tickerEvent => {
        if (metronomeSettings.enabled.getValue()) metronomeSettings.pattern.plugin.play("A0", 0, 0.5, null);
      });
*/

      let countInOffset = 0;//MusicMath.getLoopLength(metronomeSettings.pattern.length,this.bpm.getValue());
      this.playSubscription = this.scheduler.playEvent
        .subscribe((event: SchedulerEvent) => {
          patterns.find(pattern => pattern.id === event.target).plugin.play(event.note, event.time, event.length/1000, this.stopEvent);
          this.dawEvents.emit(new DawEvent(DawEventCategory.TRANSPORT_NOTE_QUEUED, event));
        });

      let events: Array<SchedulerEvent> = [];
      patterns.forEach(pattern => {
        pattern.events.forEach(event =>{
          events.push(new SchedulerEvent(event.note, event.id,event.time, pattern.id, countInOffset,event.length));
        });

        this.patternSubscriptions.push(pattern.onDestroy.subscribe(() => {
            let index= patterns.findIndex(p=>p.id===pattern.id);
            patterns.splice(index,1);
            this.scheduler.removeEventsWithTarget(pattern.id);
            if (patterns.length===0) this.stop();
        }));

        this.patternSubscriptions.push(pattern.noteInserted.subscribe((event:NoteEvent) => {
          this.scheduler.addEvent(new SchedulerEvent(event.note,event.id, event.time, pattern.id, countInOffset,event.length),pattern.getLength());
        }));
        this.patternSubscriptions.push(pattern.noteUpdated.subscribe((event:NoteEvent) => {

          this.scheduler.updateEventLength(event.id,event.length/1000);
        }));
        if (this.recordSession.state.getValue() === 1) {
          this.startEventSubscription = this.scheduler.startEvent.subscribe((startTime) => {
            this.recordSession.startTime = startTime;
            this.recordSession.state.next(2);
          })
        }
        events = _.sortBy(events, event => event.time);
        this.scheduler.run(events,countIn, loop, loopLength);

      })

    }
  }

  stop(): void {
    this.running.next(false);
    this.stopEvent.emit();
    if (this.metronomeSettingsSubscription) this.metronomeSettingsSubscription.unsubscribe();
    this.playSubscription.unsubscribe();
    if (this.tickerSubscription) this.tickerSubscription.unsubscribe();
    if (this.startEventSubscription) this.startEventSubscription.unsubscribe();
    this.scheduler.stop();
    if (this.recordSession.state.getValue() === 2) this.recordSession.state.next(0);
    this.dawEvents.emit(new DawEvent(DawEventCategory.TRANSPORT_STOP));
  }


}


