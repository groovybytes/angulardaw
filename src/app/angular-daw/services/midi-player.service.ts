import {Injectable} from "@angular/core";
import {MidiFile} from "../model/midi/midifilespec/MidiFile";
import {ProjectService} from "./project.service";
import {MidiTrack} from "../model/project/MidiTrack";
import {Note} from "../model/theory/Note";
import {Dynamics} from "../model/theory/Dynamics";
import {MidiStream} from "../model/midi/MidiStream";
import {TransportService} from "./transport.service";

declare var MIDIUtils;

@Injectable()
export class MidiPlayerService {

  constructor(private projects: ProjectService,private transport:TransportService) {

  }

  play(midi: MidiFile): void {
    this.projects.createProjectFromMidiFile(midi).then((project) => {
      let instrument = (<MidiTrack>project.tracks[1]).instrument;

      project.tracks.forEach(track=>{
        let stream = new MidiStream(this.transport);
        stream.midiEvent.subscribe(events => {
          instrument.play(0,events[0].duration,events.map(ev=>Note.fromMidiCode(ev.midi)),Dynamics.default());
        })
        stream.stream((<MidiTrack>track).notes, project.bpm);
      })



    })

  }
  /* play(midi: MidiFile): void {
    this.projects.createProjectFromMidiFile(midi).then((project) => {
      let instrument = (<MidiTrack>project.tracks[1]).instrument;


      project.tracks.forEach(track=>{
        let stream = new MidiStream(this.transport);
        stream.midiEvent.subscribe(events => {
          instrument.play(0,1,events.map(ev=>Note.getMidi(ev.midi)),Dynamics.default());
        })
        stream.stream((<MidiTrack>track).midiData.notes, project.header.bpm);
      })

    })

  }*/

}
