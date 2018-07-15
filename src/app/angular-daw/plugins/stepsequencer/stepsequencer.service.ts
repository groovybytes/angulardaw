import {Injectable} from "@angular/core";
import {NoteInfo} from "../../model/utils/NoteInfo";
import {CellInfo} from "./model/CellInfo";
import {TimeSignature} from "../../model/mip/TimeSignature";

@Injectable()
export class StepSequencerService{

  createModel(bars:number,signature:TimeSignature):Array<CellInfo>{
    let result = [];
    NoteInfo.notes = {};
    NoteInfo.load();
    let notes = Object.keys(NoteInfo.notes).reverse();
    let beats=bars*signature.beatUnit;
    for (let i = 0; i < beats*notes.length; i++) {
      let cellInfo = new CellInfo();
      cellInfo.beat=(i%signature.beatUnit)+1;
      cellInfo.bar=(i&signature.barUnit)+1;
      cellInfo.column=i%beats;
      cellInfo.row=Math.floor(i/beats);
      cellInfo.note=notes[cellInfo.row];
      result.push(cellInfo);
    }

    return result;
  }
}
