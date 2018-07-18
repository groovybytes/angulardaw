import {Injectable} from "@angular/core";
import {NoteInfo} from "../../model/utils/NoteInfo";
import {CellInfo} from "./model/CellInfo";
import {Trigger} from "../../model/triggers/Trigger";
import {DrumApi} from "../../api/drum.api";
import {Drumkit} from "../../model/mip/drums/classes/Drumkit";
import {DrumSample} from "../../model/mip/drums/classes/DrumSample";
import {NoteLength} from "../../model/mip/NoteLength";

@Injectable()
export class StepSequencerService {

  constructor(private drumService:DrumApi){

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

  createModel(bars: number,quantization:NoteLength, triggers?: Array<Trigger<string,DrumSample>>): Array<CellInfo> {
    let result = [];
    NoteInfo.notes = {};
    NoteInfo.load();

    let notes = Object.keys(NoteInfo.notes).reverse();
    let ticks = bars * quantization;
    let index = 0;
    for (let i = 0; i < ticks * notes.length; i++) {
      let row = Math.floor(i / ticks);
      let note = notes[row];
      let addNote = !triggers || triggers.filter(t => t.test(note)).length>0;
      if (addNote){
        let cellInfo = new CellInfo();
        //cellInfo.beat = (index % signature.beatUnit) + 1;
        //cellInfo.bar = (index & signature.barUnit) + 1;
        cellInfo.column = index % ticks;
        cellInfo.row = Math.floor(index / ticks);
        cellInfo.note = note;
        result.push(cellInfo);
        index++;
      }
    }

    return result;
  }
}
