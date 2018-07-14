import {NoteInfo} from "./NoteInfo";
import {Intervals} from "../mip/Intervals";

export class Chords {

  public static major(baseNote: string): Array<NoteInfo> {
    let firstNote = NoteInfo.get(baseNote);

    return [
      firstNote,
      firstNote.move(Intervals.MAJOR_THIRD),
      firstNote.move(Intervals.PERFECT_FIFTH)
    ]
  }
}
