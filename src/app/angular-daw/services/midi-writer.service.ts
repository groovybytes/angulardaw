import {Injectable} from "@angular/core";
import {Project} from "../model/project/Project";
import {MidiTrack} from "../model/project/MidiTrack";
declare var MidiConvert: any;

@Injectable()
export class MidiWriterService {


  writeProject(project:Project) {

    var midiConverter = MidiConvert.create();

    let midiTrack = midiConverter.track();
    midiTrack.patch(32)
    // chain note events: note, time, duration
      .note(60, 0, 2)
      .note(63, 1, 2)
      .note(60, 2, 2)

    let file = midiConverter.encode();


    project.tracks.forEach((track:MidiTrack)=>{


    })




  }
}
