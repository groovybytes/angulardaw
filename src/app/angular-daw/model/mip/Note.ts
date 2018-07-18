import {Loudness} from "./Loudness";
import {NoteLength} from "./NoteLength";

export class Note {
  constructor(name: string, length: NoteLength, loudness: Loudness, pitch: number) {
    this.name = name;
    this.length = length;
    this.loudness = loudness;
    this.pitch = pitch;
  }

  name: string;
  length:NoteLength;
  loudness:Loudness=Loudness.mf;
  pitch:number;
}
