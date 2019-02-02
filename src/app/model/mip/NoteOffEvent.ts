import {BasicEvent} from "./BasicEvent";

export class NoteOffEvent extends BasicEvent {

  note:string;

  constructor(note: string) {
    super();
    this.note = note;
  }


  static default(note: string): NoteOffEvent {
    return new NoteOffEvent(note);
  }
}
