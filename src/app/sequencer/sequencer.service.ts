import {ElementRef, Injectable} from "@angular/core";
import {NoteCell} from "./model/NoteCell";
import {Pattern} from "../model/daw/Pattern";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportPosition} from "../model/daw/TransportPosition";
import {ColumnInfo} from "./model/ColumnInfo";
import * as _ from "lodash";
import {NoteTriggerDto} from "../shared/api/NoteTriggerDto";
import {PatternsService} from "../shared/services/patterns.service";
import {NoteLength} from "../model/mip/NoteLength";
import {Loudness} from "../model/mip/Loudness";
import {EventCell} from "./model/EventCell";
import {TransportParams} from "../model/daw/TransportParams";
import {NoteInfo} from "../model/utils/NoteInfo";

@Injectable()
export class SequencerService {

  constructor(private patternsService: PatternsService) {


  }

  createNoteCells(transportParams:TransportParams,pattern: Pattern): Array<Array<NoteCell>> {
    let model = [];
    let nColumns = MusicMath.getBeatTicks(transportParams.quantization) * pattern.length;
    let notes;
    if (pattern.notes.length>0) notes = pattern.notes;
    else {
      NoteInfo.load();
      notes = NoteInfo.getAllIds();
    }
    for (let i = 0; i < notes.length; i++) {
      let row = [];
      model.push(row);
      for (let j = 0; j < nColumns; j++) {
        let pos = new TransportPosition();
        pos.tick = j;
        row.push(new NoteCell(pos, notes[i], i,j));
      }
    }

    return model;
  }

  createColumnInfos(transportParams:TransportParams,pattern: Pattern): Array<ColumnInfo> {
    let result = [];
    let beatTicks = MusicMath.getBeatTicks(transportParams.quantization);
    let nColumns = beatTicks * pattern.length;
    for (let i = 0; i < nColumns; i++) {
      let info = new ColumnInfo(i, null);
      if (i % beatTicks === 0) {
        info.position = new TransportPosition();
        info.position.beat = MusicMath.getBeatNumber(i, transportParams.quantization, transportParams.signature);
      }

      result.push(info);
    }

    return result;
  }

  onNoteCellClicked(event, cell: NoteCell, eventCells: Array<EventCell>, pattern: Pattern, element: ElementRef): void {

    let containerX = element.nativeElement.getBoundingClientRect().left;
    let containerY = element.nativeElement.getBoundingClientRect().top;
    let x = event.target.getBoundingClientRect().left - containerX;
    let y = event.target.getBoundingClientRect().top - containerY;

    let note = new NoteTriggerDto(null, cell.note, cell.position.time, NoteLength.Quarter, Loudness.ff, 0);
    this.patternsService.insertNote(pattern, note);
    eventCells.push(new EventCell(note, x, y,cell.column,cell.row));
    //cell.active=true;

  }

  onEventCellClicked(cell: EventCell, eventCells: Array<EventCell>, pattern: Pattern): void {
    this.patternsService.removeNote(pattern,cell.note);
    let index = _.indexOf(eventCells,cell);
    eventCells.splice(index,1);

  }

  onEventCellPositionChanged(cell:EventCell,noteCells:Array<Array<NoteCell>>,pattern:Pattern,transportParams:TransportParams):void{
    cell.note.time=cell.column*MusicMath.getTickTime(transportParams.bpm,transportParams.quantization);
    cell.note.note=noteCells[cell.row][0].note;
  }

}
