import {Lang} from "../utils/Lang";

export class SampleEventInfo{
  constructor(note: string) {
    this.note = note;
    this.id=Lang.guid();
  }


  id:string;
  note:string;
  time:number;
  offset:number;
  duration:number;
  loopLength:number;
  loopsPlayed:number=0;
  getOffset:()=>number;
  detune:number=0;



}
