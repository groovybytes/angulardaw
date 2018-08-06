import {Injectable} from "@angular/core";
import {NoteCell} from "./model/NoteCell";
import {Pattern} from "../model/daw/Pattern";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportPosition} from "../model/daw/TransportPosition";
import {ColumnInfo} from "./model/ColumnInfo";

@Injectable()
export class SequencerService {

  constructor() {


  }

  createNoteCells(pattern: Pattern): Array<Array<NoteCell>> {
    let model = [];
    let nColumns = MusicMath.getBeatTicks(pattern.transportParams.quantization)*pattern.length;
    for (let i = 0; i < pattern.notes.length; i++) {
      let row = [];
      model.push(row);
      for (let j = 0; j < nColumns; j++) {
        let pos = new TransportPosition();
        pos.tick=j;
        row.push(new NoteCell(pos,pattern.notes[i],i));
      }
    }

    return model;
  }

  createColumnInfos(pattern: Pattern): Array<ColumnInfo> {
    let result = [];
    let beatTicks = MusicMath.getBeatTicks(pattern.transportParams.quantization);
    let nColumns = beatTicks*pattern.length;
    for (let i = 0; i < nColumns; i++) {
      let info = new ColumnInfo(i,null);
      if (i % beatTicks===0) {
        info.position=new TransportPosition();
        info.position.beat=MusicMath.getBeatNumber(i,pattern.transportParams.quantization,pattern.transportParams.signature);
      }

      result.push(info);
    }

    return result;
  }

  updateEvents(cell:NoteCell,pattern:Pattern):void{

  }

}
