import {Subject} from "rxjs/internal/Subject";
import {MidiEvent} from "./MidiEvent";
import {TransportService} from "../../services/transport.service";
import {MidiFileNote} from "./midifilespec/MidiFileNote";
import {Note} from "../theory/Note";


export class MidiStream{

  midiEvent: Subject<Array<MidiEvent>> = new Subject<Array<MidiEvent>>();
  private threshold=0.1;
  constructor(private transport:TransportService){

  }

  private isMatch(transportTime: number, noteTime: number): boolean {
    let diff = transportTime - noteTime;
    return diff===0 || Math.abs(diff) <= this.threshold;
  }

  private getMatches(time:number,notes:Array<Note>):Array<Note>{
    return notes.filter(note=>this.isMatch(time,note.startTime));
  }


  stream(notes:Array<Note>,bpm:number):void{


    //let notes = Object.assign({}, track.midiData.notes);
    let i = 0;
    this.transport.bpm=bpm;
    this.transport.position.subscribe(position=>{

      let diff = notes[i].startTime-position.time;
      let matches = this.getMatches(position.time,notes.slice(i,notes.length));
      if (matches.length>0){
        let events = matches.map(match=>{
          let event = new MidiEvent();
          event.midi=match.midi;
          event.duration=match.duration;

          return event;
        })
        this.midiEvent.next(events);
        i+=events.length;
      }

      /*   if (this.isMatch(notes[i].time,position.time)){

           let event = new MidiEvent();
           event.midi=notes[i].midi;
           event.duration=notes[i].duration;
           this.midiEvent.next([event]);
           i++;
         }*/

    });

    this.transport.start();

  }
}
