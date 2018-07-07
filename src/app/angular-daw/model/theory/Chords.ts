import {Note} from "./Note";
import {Intervals} from "./Intervals";

export class Chords {

  public static major(baseNote: string): Array<string> {
    let firstNote = Note.get(baseNote);
    return [
      firstNote.id,
      firstNote.move(Intervals.MAJOR_THIRD).id,
      firstNote.move(Intervals.PERFECT_FIFTH).id
    ]
  }
}
