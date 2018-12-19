import {Inject, Injectable} from '@angular/core';
import {Pad} from "./model/Pad";
import {Push} from "./model/Push";
import {Notes} from "../model/mip/Notes";
import {PadInfo} from "./model/PadInfo";
import {KeyBindings} from "./model/KeyBindings";
import {PushSettings} from "./model/PushSettings";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(@Inject("Push") private push: Push,
              @Inject("Notes") private noteInfo: Notes) {
  }

  setup() {

    if (!this.push.keyBindings || this.push.keyBindings.length === 0) {
      this.push.keyBindings=[];
      this.push.keyBindings.push(KeyBindings.default);

    }

    this.setPadCollection(this.push.settings);

    /*if (this.push.config.activeCollection) {
      this.setPadCollection(this.push.config.activeCollection);
    } else {
      let startNote = this.noteInfo.getNote("C0");
      let endNote = this.noteInfo.getNoteByIndex((startNote.index - 1) + size * size);

      let padCollection = new PadCollection();
      padCollection.id = "default";
      padCollection.pads = [];
      this.push.config.padCollections.push(padCollection);
      this.push.config.activeCollection = "default";
      this.noteInfo.getNoteRange(startNote.id, endNote.id).forEach((note, i) => {
        let row = (size - Math.ceil((i + 1) / size)) + 1;
        let column = (i % size) + 1;
        let defaultKey = this.push.config.defaultKeyboardSetup
          .find(setting => setting.column === column && setting.row === row);

        let pad = new Pad(new PadInfo(note, row, note, column, defaultKey ? defaultKey.key : null));
        this.push.pads.push(pad);
        padCollection.pads.push(new PadInfo(note, row, "note", column, defaultKey ? defaultKey.key : null));
      });
    }*/


  }

  setPadCollection(settings: PushSettings): void {
    this.push.pads.length = 0;

    let nCells = this.push.settings.columns*this.push.settings.rows;
    let rows = this.push.settings.rows;
    let columns = this.push.settings.columns;
    let startNote = this.noteInfo.getNote(settings.baseNote);
    let endNote = this.noteInfo.getNoteByIndex((startNote.index - 1) + nCells);

    this.noteInfo.getNoteRange(startNote.id, endNote.id).forEach((note, i) => {
      let row =  rows-Math.ceil((i+1) / columns)+1;
      let column = (i % columns) + 1;
      let pad = new Pad(new PadInfo(note, row, note, column));
      this.push.pads.push(pad);
    });
  }
  changeSize(columns:number,rows:number): void {
      this.push.settings.rows=rows;
      this.push.settings.columns=columns;
      this.setPadCollection(this.push.settings);
  }

  moveMatrix(semitones:number):void{

    let baseNote = this.noteInfo.getNote(this.push.settings.baseNote);
    let newBase = this.noteInfo.move(baseNote,semitones);
    this.push.settings.baseNote=newBase.id;
    this.setPadCollection(this.push.settings);
  }

}
