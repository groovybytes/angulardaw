import {Injectable} from "@angular/core";
import {NoteInfo} from "../../model/utils/NoteInfo";
import {CellInfo} from "./model/CellInfo";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {Trigger} from "../../model/triggers/Trigger";
import {DrumService} from "../../services/drum.service";
import {Drumkit} from "../../model/mip/drums/classes/Drumkit";
import {DrumSample} from "../../model/mip/drums/classes/DrumSample";

@Injectable()
export class StepSequencerService {

  constructor(private drumService:DrumService){

  }

  loadInstrument():Promise<Drumkit>{
    return new Promise((resolve, reject) => {
      this.drumService.getDrumKit("drumkit1").then(drumkit => {
        this.drumService.getMapping("bfd2.mapping")
          .then(mapping => {
            drumkit.loadMapping(mapping);
            resolve(drumkit);
          }).catch(error=>reject(error));

      }).catch(error =>reject(error));
    })
  }

  createModel(bars: number, signature: TimeSignature, triggers?: Array<Trigger<string,DrumSample>>): Array<CellInfo> {
    let result = [];
    NoteInfo.notes = {};
    NoteInfo.load();

    let notes = Object.keys(NoteInfo.notes).reverse();
    let beats = bars * signature.beatUnit;
    let index = 0;
    for (let i = 0; i < beats * notes.length; i++) {
      let row = Math.floor(i / beats);
      let note = notes[row];
      let addNote = !triggers || triggers.filter(t => t.test(note)).length>0;
      if (addNote){
        let cellInfo = new CellInfo();
        cellInfo.beat = (index % signature.beatUnit) + 1;
        cellInfo.bar = (index & signature.barUnit) + 1;
        cellInfo.column = index % beats;
        cellInfo.row = Math.floor(index / beats);
        cellInfo.note = note;
        result.push(cellInfo);
        index++;
      }
    }

    return result;
  }
}
