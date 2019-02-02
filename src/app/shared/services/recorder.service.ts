/*
import {EventEmitter, Inject, Injectable} from '@angular/core';
import {NoteEvent} from "../../model/mip/NoteEvent";
import {Pattern} from "../../model/daw/Pattern";
import {DawInfo} from "../../model/DawInfo";
import {BehaviorSubject, Subscription} from "rxjs";
import {NoteOnEvent} from "../../model/mip/NoteOnEvent";
import {NoteOffEvent} from "../../model/mip/NoteOffEvent";
import {RecordSession} from "../../model/daw/RecordSession";

@Injectable({
  providedIn: 'root'
})
export class RecorderService {


  recordSession: BehaviorSubject<RecordSession>=new BehaviorSubject(null);
  private recordTime: number;
  private recordingEvents: Array<{ note: NoteEvent, sourceId: string, updater: any }> = [];

  constructor() {
 /!*   this.subscriptions.push(daw.destroy.subscribe(()=>{
      this.subscriptions.forEach(subscription=>subscription.unsubscribe());
    }));
*!/
  }

  recordNoteStart(event: NoteOnEvent, sourceId: string): void {
    let session = this.recordSession.getValue();
    if (session) {
      let noteEvent = NoteEvent.default(event.note);
      noteEvent.time = this.recordTime * 1000;
      noteEvent.length = 0;
      noteEvent.loudness = 1;

      if (session.pattern.insertNote(noteEvent)) {
        let updater = setInterval(() => {
          noteEvent.length = this.recordTime * 1000 - noteEvent.time;
          session.pattern.noteUpdated.emit(noteEvent);
        }, 50);
        this.recordingEvents.push({sourceId: sourceId, note: noteEvent, updater: updater});

      } else console.log("cant insert note");
    }
  }

  recordNoteEnd(event: NoteOffEvent,  sourceId: string): void {
    //todo: handle running notes when recording is stopped
    let session = this.recordSession.getValue();
    if (session) {
      let index = this.recordingEvents
        .findIndex(_event =>
          _event.note.note === event.note && _event.sourceId === sourceId);
      if (index >= 0) {
        this.recordingEvents[index].note.length = this.recordTime * 1000 - this.recordingEvents[index].note.time;
        session.pattern.noteUpdated.emit(this.recordingEvents[index].note);
        clearInterval(this.recordingEvents[index].updater);
        this.recordingEvents.splice(index, 1);
      }
    }

  }


}


*/
