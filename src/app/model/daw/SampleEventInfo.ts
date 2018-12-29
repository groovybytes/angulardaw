import {Lang} from "../utils/Lang";

export class SampleEventInfo{
  constructor() {

    this.id=Lang.guid();
  }


  id:string;
  note:string;
  offset:number;
  duration:number;
  loopLength:number;
  loop:boolean;
  loopsPlayed:number=0;
  getLoopStartTime:()=>number;
  detune:number=0;



}
