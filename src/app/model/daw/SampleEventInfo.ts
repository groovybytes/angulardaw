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

  public static create(note:string,offset:number,duration:number):SampleEventInfo{
    let event = new SampleEventInfo();
    event.note=note;
    event.offset=offset;
    event.duration=duration;

    return event;
  }



}
