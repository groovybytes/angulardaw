import {Note} from "./Note";
import {Intervals} from "./Intervals";

export class Chords {

  public static major(baseNote: string): Array<Note> {
    let firstNote = Note.get(baseNote);

    return [
      firstNote,
      firstNote.move(Intervals.MAJOR_THIRD),
      firstNote.move(Intervals.PERFECT_FIFTH)
    ]
  }
}
