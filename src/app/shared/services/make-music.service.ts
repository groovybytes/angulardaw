import {EventEmitter, Inject, Injectable} from '@angular/core';
import {AudioContextService} from "./audiocontext.service";
import {SampleEventInfo} from "../../model/daw/SampleEventInfo";
import {DawInfo} from "../../model/DawInfo";
import {Subscription} from "rxjs";
import {AudioPlugin} from "../../model/daw/plugins/AudioPlugin";
import {Notes} from "../../model/mip/Notes";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {NoteOnEvent} from "../../model/mip/NoteOnEvent";
import {NoteOffEvent} from "../../model/mip/NoteOffEvent";
import {RecordSession} from "../../model/daw/RecordSession";
import {PatternsService} from "./patterns.service";
import {Pattern} from "../../model/daw/Pattern";
import {MusicMath} from "../../model/utils/MusicMath";

@Injectable({
  providedIn: 'root'
})
export class MakeMusicService {

  private subscriptions: Array<Subscription> = [];
  private eventMarkers: Array<EventMarker> = [];


  constructor(
    private audioContextService: AudioContextService,
    private patternsService: PatternsService,
    @Inject("daw") private daw: DawInfo,
    @Inject("Notes") private notes: Notes
  ) {

    this.subscriptions.push(daw.destroy.subscribe(() => this.destroy()));

  }


  private destroy(): void {
    this.eventMarkers.forEach(note => note.stopEvent.emit());
    this.eventMarkers.length = 0;
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /*toggleRecord(): void {
    let project = this.daw.project.getValue();

    if (project.recordSession.hot.getValue()) {
      this.patternsService.stop(project);
      project.recordSession.hot.next(false);
    } else if (project.selectedPattern.getValue()) {
      project.recordSession.pattern=project.selectedPattern.getValue();
      this.patternsService.startPattern(project.selectedPattern.getValue().id,project);

    }
  }*/


  startPlay(note: string): void {

    let stopEvent = new EventEmitter<void>();
    let eventMarker = new EventMarker(stopEvent, note);
    this.eventMarkers.push(eventMarker);
    let currentTime = this.audioContextService.getTime() * 1000;
    let project = this.daw.project.getValue();
    let pluginTarget = project.activePlugin.getValue();
    pluginTarget.play(note, 0, undefined, stopEvent);
    let recordSession = project.recordSession;
    if (recordSession.state.getValue() === 2) {
      eventMarker.startTime = currentTime;
      eventMarker.recordingNoteEvent = NoteEvent.default(eventMarker.note);

      let loopLength = MusicMath.getLoopLength(recordSession.pattern.length, project.bpm.getValue());
      let triggerTime = ((this.audioContextService.getTime() - recordSession.startTime) % loopLength) * 1000;
      eventMarker.recordingNoteEvent.time = triggerTime;
      eventMarker.recordingNoteEvent.length = 0;
      eventMarker.recordingNoteEvent.loudness = 1;


      if (recordSession.pattern.insertNote(eventMarker.recordingNoteEvent)) {
        eventMarker.updater = setInterval(() =>
          this.updateNoteEvent(recordSession.pattern, eventMarker.recordingNoteEvent, eventMarker), 100);
      } else console.warn("no matching event found for recording");
    }

  }


  stopPlay(note: string): void {
    let index = this.eventMarkers.findIndex(d => d.note === note);
    let marker = this.eventMarkers[index];
    if (!marker) debugger;
    if (marker.updater) {
      this.updateNoteEvent(this.daw.project.getValue().recordSession.pattern, marker.recordingNoteEvent, marker);
      clearInterval(marker.updater);
    }
    marker.stopEvent.emit();
    this.eventMarkers.splice(index, 1);
  }


  private getNoteLength(eventMarker: EventMarker): number {
    return this.audioContextService.getTime() * 1000 - eventMarker.startTime;
  }

  private updateNoteEvent(pattern: Pattern, noteEvent: NoteEvent, eventMarker: EventMarker): void {
    noteEvent.length = this.getNoteLength(eventMarker);
    pattern.noteUpdated.emit(noteEvent);
  }

  /* recordNoteEnd(session: RecordSession,event: NoteOffEvent, sourceId: string): void {


       let index = this.recordingEvents
         .findIndex(_event =>
           _event.note.note === event.note && _event.sourceId === sourceId);
       if (index >= 0) {
         this.recordingEvents[index].note.length = this.recordTime * 1000 - this.recordingEvents[index].note.time;
         session.pattern.noteUpdated.emit(this.recordingEvents[index].note);
         clearInterval(this.recordingEvents[index].updater);
         this.recordingEvents.splice(index, 1);
       }


   }*/

}

class EventMarker {
  stopEvent: EventEmitter<void>;
  note: string;
  updater: any;
  startTime: number;
  recordingNoteEvent: NoteEvent;

  constructor(stopEvent: EventEmitter<void>, note: string) {
    this.stopEvent = stopEvent;
    this.note = note;
  }
}
