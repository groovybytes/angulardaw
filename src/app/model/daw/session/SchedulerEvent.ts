import {NoteEvent} from "../../mip/NoteEvent";


export class SchedulerEvent {
  constructor(note: string,id:string, time: number, target: string, offset: number,length:number) {
    this.note = note;
    this.id = id;
    this.time = time;
    this.target = target;
    this.offset = offset;
    this.length=length;
  }

  note:string;
  id:string;
  time:number;
  target:string;
  offset:number;
  length:number;

}
