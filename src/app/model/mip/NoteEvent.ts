import {Lang} from "../utils/Lang";
import {NoteDynamics} from "./NoteDynamics";


export class NoteEvent {
  readonly id: string;
  time: number;
  note: string;
  length: number;
  dynamics: NoteDynamics;

  constructor(note: string, dynamics: NoteDynamics, time?: number, length?: number) {
    this.id = Lang.guid();
    this.time = time;
    this.note = note;
    this.length = length;
    this.dynamics = dynamics;
  }

  /*  static default(note: string): NoteEvent {
      return new NoteEvent(note);
    }*/


}
