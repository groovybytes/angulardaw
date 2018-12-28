import {Lang} from "../utils/Lang";
import {Sample} from "../daw/Sample";


export class NoteEvent{
  readonly id: string;
  time: number;
  note: string;
  length: number;
  loudness: number;
  articulation: number;
  sample:Sample;


  constructor(note: string,time?: number, length?: number, loudness?: number, articulation?: number) {
    this.id = Lang.guid();
    this.time = time;
    this.note = note;
    this.length = length;
    this.loudness = loudness;
    this.articulation = articulation;
  }

  static default(note:string):NoteEvent{
    return new NoteEvent(note);
  }



}
