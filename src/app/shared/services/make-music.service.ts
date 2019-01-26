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
import {NoteDynamics} from "../../model/mip/NoteDynamics";

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


  startPlay(note: string): void {

    let stopEvent = new EventEmitter<void>();
    let eventMarker = new EventMarker(stopEvent, note);
    this.eventMarkers.push(eventMarker);
    let currentTime = this.audioContextService.getTime() * 1000;
    let project = this.daw.project.getValue();
    let pluginTarget = project.activePlugin.getValue();

    let playEvent = NoteEvent.default(eventMarker.note);
    playEvent.time=this.audioContextService.getTime();
    playEvent.attack=0.1;

    pluginTarget.play(playEvent,stopEvent,true);
    let recordSession = project.recordSession;
    if (recordSession.state.getValue() === 2) {
      eventMarker.startTime = currentTime;
      eventMarker.recordingNoteEvent = NoteEvent.default(eventMarker.note);

      let loopLength = MusicMath.getLoopLength(recordSession.pattern.length, project.settings.bpm.getValue());
      let triggerTime = ((this.audioContextService.getTime() - recordSession.startTime) % loopLength) * 1000;
      eventMarker.recordingNoteEvent.time = triggerTime;
      eventMarker.recordingNoteEvent.length = 0;
      eventMarker.recordingNoteEvent.target = recordSession.pattern.id;


      if (recordSession.pattern.insertNote(eventMarker.recordingNoteEvent)) {
        eventMarker.updater = setInterval(() =>
          this.updateNoteEvent(recordSession.pattern, eventMarker.recordingNoteEvent, eventMarker), 0);
      } else console.warn("no matching event found for recording");
    }

  }


  stopPlay(note: string): void {
    let index = this.eventMarkers.findIndex(d => d.note === note);
    let marker = this.eventMarkers[index];
    if (marker.recordingNoteEvent) NoteEvent.updateAdsr(marker.recordingNoteEvent);
    if (!marker) console.error("no marker");
    if (marker.updater) {
      this.updateNoteEvent(this.daw.project.getValue().recordSession.pattern, marker.recordingNoteEvent, marker);
      clearInterval(marker.updater);
    }
    marker.stopEvent.emit();
    this.eventMarkers.splice(index, 1);
  }


  private getNoteLength(eventMarker: EventMarker): number {
    return (this.audioContextService.getTime() * 1000 - eventMarker.startTime)*1000;
  }

  private updateNoteEvent(pattern: Pattern, noteEvent: NoteEvent, eventMarker: EventMarker): void {

    noteEvent.length = this.getNoteLength(eventMarker)/1000;
    pattern.noteUpdated.emit(noteEvent);
  }


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
