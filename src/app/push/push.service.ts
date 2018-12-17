import {Inject, Injectable} from '@angular/core';
import {PadInfo} from "./push-matrix/model/PadInfo";
import {Push} from "./model/Push";
import {Notes} from "../model/mip/Notes";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor( @Inject("Push") private push: Push,
               @Inject("Notes") private noteInfo: Notes) { }

  setup(size:number) {
    let startNote = this.noteInfo.getNote("C0");
    let endNote = this.noteInfo.getNoteByIndex((startNote.index - 1) + size * size);

    this.noteInfo.getNoteRange(startNote.id, endNote.id).forEach((note, i) => {
      let row = (size - Math.ceil((i + 1) / size)) + 1;
      let column = (i % size) + 1;
      let pad = new PadInfo(note, row, column, null);
      this.push.pads.push(pad);
    });

  }

}
