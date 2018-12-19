import {Inject, Injectable} from '@angular/core';
import {Pad} from "./model/Pad";
import {Push} from "./model/Push";
import {Notes} from "../model/mip/Notes";
import {PadInfo} from "./model/PadInfo";
import {KeyBindings} from "./model/KeyBindings";
import {PushSettings} from "./model/PushSettings";
import {Scale} from "../model/mip/scales/Scale";
import {ScaleId} from "../model/mip/scales/ScaleId";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(@Inject("Push") private push: Push,
              @Inject("Notes") private noteInfo: Notes) {
  }

  setup() {

    if (!this.push.keyBindings || this.push.keyBindings.length === 0) {
      this.push.keyBindings = [];
      this.push.keyBindings.push(KeyBindings.default);

    }
    this.setPadCollection(this.push.settings);


  }

  setPadCollection(settings: PushSettings): void {
    this.push.pads.length = 0;

    let notes = this.noteInfo;
    if (settings.scale !== ScaleId.CHROMATIC) {
      notes = new Notes(settings.scale);
    }
    let rows = this.push.settings.rows;
    let columns = this.push.settings.columns;
    let startIndex = notes.getNote(settings.baseNote).index;

    let currentIndex = startIndex;
    for (let i = 0; i < rows; i++) {
      if (i > 0) currentIndex = startIndex + 3 * i;

      for (let j = 0; j < columns; j++) {
        let note = notes.getNoteByIndex(currentIndex);
        let pad = new Pad(new PadInfo(note.id, rows - (i + 1) + 1, note.id, j + 1));
        this.push.pads.push(pad);

        currentIndex++;
      }
    }
  }


  changeSize(columns: number, rows: number): void {
    this.push.settings.rows = rows;
    this.push.settings.columns = columns;
    this.setPadCollection(this.push.settings);
  }

  moveMatrix(semitones: number): void {

    let baseNote = this.noteInfo.getNote(this.push.settings.baseNote);
    let newBase = this.noteInfo.move(baseNote, semitones);
    this.push.settings.baseNote = newBase.id;
    this.setPadCollection(this.push.settings);
  }

}
