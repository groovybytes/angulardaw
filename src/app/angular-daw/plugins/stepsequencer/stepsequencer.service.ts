import {Injectable} from "@angular/core";
import {NoteInfo} from "../../model/utils/NoteInfo";
import {CellInfo} from "./model/CellInfo";
import {Trigger} from "../../model/triggers/Trigger";
import {DrumApi} from "../../api/drum.api";
import {Drumkit} from "../../model/mip/drums/classes/Drumkit";
import {DrumSample} from "../../model/mip/drums/classes/DrumSample";
import {NoteLength} from "../../model/mip/NoteLength";
import {MusicMath} from "../../model/utils/MusicMath";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {TransportPosition} from "../../model/daw/TransportPosition";

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

  createModel(bars: number,quantization:NoteLength,signature:TimeSignature, triggers?: Array<Trigger<string,DrumSample>>): Array<CellInfo> {
    let result = [];
    NoteInfo.notes = {};
    NoteInfo.load();

    let notes = Object.keys(NoteInfo.notes).reverse();
    let ticks = MusicMath.getBarTicks(quantization,signature)*bars;
    let index = 0;
    for (let i = 0; i < ticks * notes.length; i++) {
      let row = Math.floor(i / ticks);
      let note = notes[row];
      let addNote = !triggers || triggers.filter(t => t.test(note)).length>0;
      if (addNote){
        let cellInfo = new CellInfo();
        cellInfo.position=new TransportPosition();
        cellInfo.column = index % ticks;
        cellInfo.row = Math.floor(index / ticks);
        cellInfo.note = note;
        cellInfo.position.beat=MusicMath.getBeatNumber(cellInfo.column,quantization,signature);
        result.push(cellInfo);
        index++;
      }
    }

    return result;
  }
}
