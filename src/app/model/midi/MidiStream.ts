/*
import {Subject} from "rxjs/internal/Subject";
import {MidiEvent} from "./MidiEvent";
import {NoteInfo} from "../utils/NoteInfo";
import {MusicMath} from "../utils/MusicMath";
import {Scheduler} from "../daw/Scheduler";


export class MidiStream{

  midiEvent: Subject<Array<MidiEvent>> = new Subject<Array<MidiEvent>>();
  private threshold=0.1;
  constructor(private transport:Scheduler){

  }

  private isMatch(transportTime: number, noteTime: number): boolean {
    let diff = transportTime - noteTime;
    return diff===0 || Math.abs(diff) <= this.threshold;
  }

  private getMatches(time:number,notes:Array<NoteInfo>):Array<NoteInfo>{
    return notes.filter(note=>this.isMatch(time,note.startTime));
  }

  stream(notes:Array<NoteInfo>, bpm:number):void{


    //let notes = Object.assign({}, track.midiData.notes);
    let i = 0;
    this.transport.tickInterval=MusicMath.getBeatTime(bpm);
    this.transport.time.subscribe(position=>{

      let diff = notes[i].startTime-position;
      let matches = this.getMatches(position,notes.slice(i,notes.length));
      if (matches.length>0){
        let events = matches.map(match=>{
          let event = new MidiEvent();
          event.midi=match.midi;
          event.length=match.length;

          return event;
        })
        this.midiEvent.next(events);
        i+=events.length;
      }

      /!*   if (this.isMatch(notes[i].time,position.time)){

           let event = new MidiEvent();
           event.midi=notes[i].midi;
           event.length=notes[i].length;
           this.midiEvent.next([event]);
           i++;
         }*!/

    });

    this.transport.start();

  }
}
*/
