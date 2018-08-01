import {Loudness} from "./Loudness";
import {NoteLength} from "./NoteLength";
import {NoteArticulation} from "./NoteArticulation";

export class NoteDynamics {
  constructor(length: NoteLength, loudness: Loudness) {
    this.length = length;
    this.loudness = loudness;
  }

  length: NoteLength;
  loudness: Loudness = Loudness.mf;
  articulation: NoteArticulation = NoteArticulation.Legato;

}
