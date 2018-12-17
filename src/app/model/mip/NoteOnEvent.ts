import {BasicEvent} from "./BasicEvent";

export class NoteOnEvent extends BasicEvent{


  constructor(note: string) {
    super();
    this.note = note;

  }

  note:string;


  static default(note:string):NoteOnEvent{
    return new NoteOnEvent(note);
  }

}
