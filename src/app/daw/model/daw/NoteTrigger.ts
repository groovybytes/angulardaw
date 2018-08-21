import {INoteTrigger} from "../mip/NoteTrigger";

export class NoteTrigger implements INoteTrigger{
  id: any;
  time: number;
  note: string;
  length: number;
  loudness: number;
  articulation: number;
  column:number=0;
  row:number=0;
  offset:number=0;

  constructor(id: any, note: string,time?: number, length?: number, loudness?: number, articulation?: number) {
    this.id = id;
    this.time = time;
    this.note = note;
    this.length = length;
    this.loudness = loudness;
    this.articulation = articulation;
  }
}
