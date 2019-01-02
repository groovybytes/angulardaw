import {Inject, Injectable} from '@angular/core';
import {NoteEvent} from "../../model/mip/NoteEvent";
import {Notes} from "../../model/mip/Notes";
import {NoteLength} from "../../model/mip/NoteLength";
import {Pattern} from "../../model/daw/Pattern";
import {PatternsService} from "./patterns.service";
import {DawInfo} from "../../model/DawInfo";

declare var MidiConvert;

@Injectable({
  providedIn: 'root'
})
export class MidiBridgeService {

  constructor(
    @Inject("Notes") private notes: Notes,
    private patternService: PatternsService,
    @Inject("daw") private daw: DawInfo) {
  }


  convertMidi(url: string): Promise<Array<NoteEvent>> {

    return new Promise<Array<NoteEvent>>((resolve, reject) => {
      MidiConvert.load(url, (midi) => {
        let converted = midi.tracks[1].notes.map(midiEvent => {
          let noteInfo = this.notes.notes.find(d => d.midi === midiEvent.midi);
          return new NoteEvent(noteInfo.id, midiEvent.time*1000, midiEvent.duration, midiEvent.velocity);
        });
        resolve(converted);
      })
    });


  }

  convertMidiToPattern(trackId: string, url: string): Promise<Pattern> {

    return new Promise<Pattern>((resolve, reject) => {
      let project = this.daw.project.getValue();
      this.convertMidi(url)
        .then(notes => {
          let pattern = this.patternService.createPattern(project, trackId, NoteLength.Quarter, 8);
          notes.forEach(note => pattern.insertNote(note));
          resolve(pattern);
        });
    });


  }


}
