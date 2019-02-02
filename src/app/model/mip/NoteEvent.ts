import {Lang} from "../utils/Lang";
import * as _ from "lodash";

export class NoteEvent{
  // values in ms!

  readonly id: string;
  time: number;
  note: string;
  length: number;
  attack:number=0.1;
  decay:number;
  decayReduction:number;
  release:number=0;
  sustain:number=0;
  target:string;
  offset:number=0; //dont serialize! used for countin

  constructor(note: string,createDefaultAdsr:boolean,time?: number, length?: number,target?:string) {
    this.id = Lang.guid();
    this.time = time;
    this.note = note;
    this.length = length;
    this.target = target;

    if (createDefaultAdsr){
      NoteEvent.updateAdsr(this);
    }
  }

  static default(note:string):NoteEvent{
    return new NoteEvent(note,true);
  }

  static updateLength(event:NoteEvent,newLength:number):void{

    let changeFactor=newLength/event.length;
    event.length=newLength;

    if (event.attack>0) event.attack=event.attack*changeFactor;
    if (event.release>0) event.release=event.release*changeFactor;
    if (event.sustain>0) event.sustain=event.sustain*changeFactor;
    if (event.decay>0) event.decay=event.decay*changeFactor;

  }
  
  static updateAdsr(event:NoteEvent):void{


    event.attack=0.1;
    event.decayReduction=0.1;
    if (event.length){
      event.sustain=event.length*70/100;
      event.decay=event.length*5/100;
      event.release=event.length-event.sustain-event.attack;
    }


  }

  static clone(event:NoteEvent):NoteEvent{
    return _.clone(event);
  }



}
