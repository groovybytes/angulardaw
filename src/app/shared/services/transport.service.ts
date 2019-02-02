import {EventEmitter, Inject, Injectable} from '@angular/core';
import {Scheduler} from "../../model/daw/session/Scheduler";
import {BehaviorSubject, Subscription} from "rxjs";
import {DawEvent} from "../../model/daw/DawEvent";
import {Pattern} from "../../model/daw/Pattern";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {DawEventCategory} from "../../model/daw/DawEventCategory";
import * as _ from "lodash";
import {AudioContextService} from "./audiocontext.service";
import {DawInfo} from "../../model/DawInfo";
import {NoteLength} from "../../model/mip/NoteLength";
import {MusicMath} from "../../model/utils/MusicMath";
import {TriggerSpec} from "../../model/daw/TriggerSpec";

@Injectable()
export class TransportService {

  private scheduler: Scheduler;
  private stopEvent: EventEmitter<void> = new EventEmitter();
  readonly running: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private playSubscription: Subscription;
  private tickerSubscription: Subscription;
  private startEventSubscription: Subscription;
  private patternSubscriptions: Array<Subscription> = [];
  private schedulerInitialized: boolean = false;

  constructor(
    @Inject("daw") private daw: DawInfo,
    private audioContext: AudioContextService) {


  }

  /// loopLength: seconds
  // countIn: beats
  start(patterns: Array<Pattern>, countIn: number, loop: boolean, loopLength: number): void {
    //important: instantiate scheduler here instead of constructor to avoid google audio problem
    if (!this.scheduler) this.scheduler = new Scheduler(this.audioContext.getAudioContext());
    let project = this.daw.project.getValue();

    patterns.push(this.createMetronomePattern(patterns[0].length));
    if (!this.schedulerInitialized) {
      this.scheduler.init(project.events, project.settings.bpm, project.threads.find(t => t.id === "ticker"));
      this.schedulerInitialized = true;
    }
    if (this.running.getValue()) this.stop();
    else {
      this.running.next(true);
      //console.log(countIn);
      //MusicMath.getLength(1, project.settings.bpm.getValue(), project.settings.signature.beatUnit)

      this.playSubscription = this.scheduler.playEvent
        .subscribe((event: NoteEvent) => {
          let pattern = patterns.find(pattern => pattern.id === event.target);
          pattern.plugin.play(event, this.stopEvent);
          project.events.emit(new DawEvent(DawEventCategory.TRANSPORT_NOTE_QUEUED, event));

        });

      //let countInOffset = 0;//MusicMath.getLength(1, project.settings.bpm.getValue(), project.settings.signature.beatUnit)/1000;


      let events: Array<NoteEvent> = [];

      patterns.forEach(pattern => {
        //todo: use concat
        pattern.events.forEach(event => {
          events.push(event);
        });

        this.patternSubscriptions.push(pattern.onDestroy.subscribe(() => {
          let index = patterns.findIndex(p => p.id === pattern.id);
          patterns.splice(index, 1);
          this.scheduler.removeEventsWithTarget(pattern.id);
          if (patterns.length === 0) this.stop();
        }));
        this.patternSubscriptions.push(pattern.noteInserted.subscribe((event: NoteEvent) => {
          this.scheduler.addEvent(event, pattern.getLength());
        }));
        this.patternSubscriptions.push(pattern.noteUpdated.subscribe((event: NoteEvent) => {

          this.scheduler.updateEventLength(event.id, event.length);
        }));
        if (project.recordSession.state.getValue() === 1) {
          this.startEventSubscription = this.scheduler.startEvent.subscribe((startTime) => {
            project.recordSession.startTime = startTime;
            project.recordSession.state.next(2);
          })
        }


      });

      events = _.sortBy(events, event => event.time);
      this.scheduler.run(events, countIn, loop, loopLength);

    }
  }

  stop(): void {
    let project = this.daw.project.getValue();
    this.running.next(false);
    this.stopEvent.emit();
    this.playSubscription.unsubscribe();
    if (this.tickerSubscription) this.tickerSubscription.unsubscribe();
    if (this.startEventSubscription) this.startEventSubscription.unsubscribe();
    this.scheduler.stop();
    if (project.recordSession.state.getValue() === 2) project.recordSession.state.next(0);
    project.events.emit(new DawEvent(DawEventCategory.TRANSPORT_STOP));
  }

  private createMetronomePattern(patternLength: number): Pattern {
    let project = this.daw.project.getValue();
    let pattern = new Pattern("_metronome-pattern",
      [new TriggerSpec("A0", "", ""), new TriggerSpec("B0", "", "")],
      null,
      project.settings,
      project.metronomePlugin,
      NoteLength.Quarter);

    for (let i = 0; i < patternLength; i++) {
      pattern.insertNote(new NoteEvent(i % project.settings.signature.beatUnit === 0 ? "A0" : "B0", true, i * MusicMath.getBeatTime(120), 500, pattern.id));
    }

    return pattern;
  }


}
