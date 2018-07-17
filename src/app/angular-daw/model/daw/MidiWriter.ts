import {Injectable} from "@angular/core";
import {Project} from "./Project";


declare var MidiConvert: any;

@Injectable()
export class MidiWriter {


  writeProject(project:Project):any {

    // create a new midi file
    var midi = MidiConvert.create()
// add a track
    midi.track()
    // select an instrument by its MIDI patch number
      .patch(32)
      // chain note events: note, time, duration
      .note(60, 0, 2)
      .note(63, 1, 2)
      .note(60, 2, 2)

// write the output
    return midi.encode();





  }
}
