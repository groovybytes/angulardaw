import {Injectable} from "@angular/core";
import {MidiFile} from "../model/midi/midifilespec/MidiFile";
import {Project} from "../model/project/Project";
import {MidiTrack} from "../model/project/MidiTrack";
import {SamplesService} from "./samples.service";
import {InstrumentsEnum} from "../model/InstrumentsEnum";
import {Instrument} from "../model/Instrument";
import {Note} from "../model/theory/Note";

@Injectable()
export class ProjectService {

  constructor(private samplesService:SamplesService) {

  }

  createProjectFromMidiFile(midi: MidiFile): Promise<Project> {
    let project = new Project();
    project.bpm=midi.header.bpm;
    return new Promise((resolve, reject) => {
      let promises = [];
      midi.tracks.forEach(fileTrack => {
        if (fileTrack.notes && fileTrack.notes.length >0) {
          let track = new MidiTrack();
          track.notes = fileTrack.notes.map(note=>Note.fromMidiNote(note));
          project.tracks.push(track);
          let promise = this.samplesService.getSamplesForInstrument(InstrumentsEnum.PIANO).then(results => {
            let instrument = new Instrument();
            instrument.id = InstrumentsEnum.PIANO;
            instrument.samples = results;
            track.instrument = instrument;

          })
          promises.push(promise);
        }
      });

      Promise.all(promises).then(() => resolve(project)).catch(error=>console.log(error))
    })
  }
}
