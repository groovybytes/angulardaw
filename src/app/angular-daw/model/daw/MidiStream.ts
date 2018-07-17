import {Subject} from "rxjs/internal/Subject";
import {MidiEvent} from "../midi/MidiEvent";
import {MidiFileNote} from "../midi/midifilespec/MidiFileNote";
import {MusicMath} from "../utils/MusicMath";
import {Transport} from "./Transport";


export class MidiStream{

  midiEvent: Subject<Array<MidiEvent>> = new Subject<Array<MidiEvent>>();
  private threshold=0.1;
  constructor(private transport:Transport){

  }

  private isMatch(transportTime: number, noteTime: number): boolean {
    let diff = transportTime - noteTime;
    return diff===0 || Math.abs(diff) <= this.threshold;
  }

  private getMatches(time:number,notes:Array<MidiFileNote>):Array<MidiFileNote>{
    return notes.filter(note=>this.isMatch(time,note.time));
  }


  stream(notes:Array<MidiFileNote>,bpm:number):void{

    let i = 0;
    let nLookAhead=10;
    this.transport.tickInterval=MusicMath.getBeatTime(bpm);
    this.transport.time.subscribe(position=>{

      let matches = this.getMatches(position,notes.slice(i,nLookAhead));
      if (matches.length>0){
        let events = matches.map(match=>{
          let event = new MidiEvent();
          event.midi=match.midi;
          event.duration=match.duration;
          return event;
        })
        this.midiEvent.next(events);
        i+=matches.length;
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
