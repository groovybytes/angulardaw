import {Inject, Injectable} from '@angular/core';
import {NoteEvent} from "../../model/mip/NoteEvent";
import {Notes} from "../../model/mip/Notes";
import {Project} from "../../model/daw/Project";

declare var MidiConvert;

@Injectable({
  providedIn: 'root'
})
export class MidiBridgeService {

  constructor(@Inject("Notes") private notes: Notes) {
  }


  convertMidi(project: Project, url: string): Promise<Array<NoteEvent>> {

    return new Promise<Array<NoteEvent>>((resolve, reject) => {
      MidiConvert.load(url, (midi) => {
        let converted = midi.tracks[1].notes.map(midiEvent => {
          let noteInfo = this.notes.notes.find(d => d.midi === midiEvent.midi);
          return new NoteEvent(noteInfo.id, midiEvent.time, midiEvent.duration, midiEvent.velocity);
        });
        resolve(converted);
      })
    });


  }
}
