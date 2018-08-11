import {ElementRef, Injectable} from "@angular/core";
import {Cell} from "./model/Cell";
import {Pattern} from "../model/daw/Pattern";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportPosition} from "../model/daw/TransportPosition";
import {HeaderCell} from "./model/HeaderCell";
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

  createNoteCells(transportParams: TransportParams, pattern: Pattern): Array<Array<Cell>> {

    /*let result:Array<Cell>=[];
    let notes:Array<string>=pattern.notes;
    if (notes.length===0) {
      NoteInfo.load();
      let allNotes = NoteInfo.getAllIds();
      notes=allNotes;
    }

    let columns = MusicMath.getBeatTicks(transportParams.quantization)*pattern.length;
    let rows = notes.length;
    let nCells = columns*rows;

    for (let i = 0; i <= nCells; i++) {
      let row = Math.floor(i/columns);
      let column = i % columns;
      let cell =  new Cell(null,null,notes[row],row,column);
      result.push(cell);
    }
    debugger;
    return result;*/

    let model = [];
    let nColumns = MusicMath.getBeatTicks(transportParams.quantization) * pattern.length;
    let notes;
    if (pattern.notes.length > 0) notes = pattern.notes;
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
        let cell = new Cell(null, pos, notes[i], i, j);
        cell.events = pattern.events.filter(ev => ev.row === cell.row && ev.column === cell.column);
        row.push(cell);
      }
    }

    return model;

  }

  createHeaderCells(transportParams: TransportParams, pattern: Pattern): Array<HeaderCell> {
    let result = [];
    let beatTicks = MusicMath.getBeatTicks(transportParams.quantization);
    let nColumns = beatTicks * pattern.length;
    for (let i = 0; i < nColumns; i++) {
      let info = new HeaderCell(i, null);
      if (i % beatTicks === 0) {
        info.position = new TransportPosition();
        info.position.beat = MusicMath.getBeatNumber(i, transportParams.quantization, transportParams.signature);
      }

      result.push(info);
    }

    return result;
  }

  onNoteCellClicked(cell: Cell, pattern: Pattern): void {
    if (cell.events.length>0) {

    }
    else {
      let trigger = new NoteTriggerDto(null, cell.note, cell.position.time, NoteLength.Quarter, Loudness.fff, 0);
      cell.events.push(trigger);
      trigger.column = cell.column;
      trigger.row = cell.row;
      this.patternsService.insertNote(pattern, trigger);
    }


  }

  onEventCellClicked(cell: EventCell, eventCells: Array<EventCell>, pattern: Pattern): void {
    this.patternsService.removeNote(pattern, cell.note);
    let index = _.indexOf(eventCells, cell);
    eventCells.splice(index, 1);

  }

  onEventCellPositionChanged(cell: EventCell, noteCells: Array<Array<Cell>>, pattern: Pattern, transportParams: TransportParams): void {
    cell.note.time = cell.column * MusicMath.getTickTime(transportParams.bpm, transportParams.quantization);
    cell.note.note = noteCells[cell.row][0].note;
  }

}
