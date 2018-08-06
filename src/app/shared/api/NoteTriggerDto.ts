import {NoteTrigger} from "../../model/mip/NoteTrigger";

export class NoteTriggerDto implements NoteTrigger{
  id: any;
  time: number;
  note: string;
  length: number;
  loudness: number;
  articulation: number;

  constructor(id: any, note: string,time?: number, length?: number, loudness?: number, articulation?: number) {
    this.id = id;
    this.time = time;
    this.note = note;
    this.length = length;
    this.loudness = loudness;
    this.articulation = articulation;
  }
}
