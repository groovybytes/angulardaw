import {Injectable} from "@angular/core";
import {Pattern} from "../model/daw/Pattern";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportPosition} from "../model/daw/TransportPosition";
import {PatternsService} from "../shared/services/patterns.service";
import {TransportParams} from "../model/daw/TransportParams";
import {NoteInfo} from "../model/utils/NoteInfo";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../ui/flexytable/model/HeaderCell";
import {Loudness} from "../model/mip/Loudness";
import {NoteLength} from "../model/mip/NoteLength";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {NoteTriggerDto} from "../shared/api/NoteTriggerDto";

@Injectable()
export class SequencerService {

  constructor(private patternsService: PatternsService) {


  }

  createHeaderCells(transportParams: TransportParams, pattern: Pattern): Array<HeaderCell<any>> {
    let result = [];
    let beatTicks = MusicMath.getBeatTicks(transportParams.quantization);
    let nColumns = beatTicks * pattern.length;
    for (let i = 0; i < nColumns; i++) {
      let info = new HeaderCell();
      /* if (i % beatTicks === 0) {
         info.position = new TransportPosition();
         info.position.beat = MusicMath.getBeatNumber(i, transportParams.quantization, transportParams.signature);
       }*/

      result.push(info);
    }

    return result;
  }

  createNoteCells(transportParams: TransportParams, pattern: Pattern): Array<Array<ContentCell>> {

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
    let notes = this.getPatternNotes(pattern);
    for (let i = 0; i < notes.length; i++) {
      let row = [];
      model.push(row);
      for (let j = 0; j < nColumns; j++) {
        let cell = new ContentCell(i, j);
        row.push(cell);
      }
    }

    return model;

  }

  createEntries(pattern: Pattern, cellWidth: number, cellHeight: number, params: TransportParams): Array<FlexyGridEntry<NoteTriggerDto>> {
    let result = [];
    pattern.events.forEach(event => {
      let fullTime = MusicMath.getTimeAtBeat(pattern.length, params.bpm, params.quantization);
      let tick = MusicMath.getTickForTime(event.time, params.bpm, params.quantization);
      let left = cellWidth * tick;
      let notes = this.getPatternNotes(pattern);
      let rowIndex = notes.indexOf(event.note);
      let top = rowIndex * cellHeight;

      let entry = new FlexyGridEntry(event,left,top);
      console.log(entry);
      result.push(entry);
    });
    return result;
  }

  private getPatternNotes(pattern: Pattern): Array<string> {
    let notes: Array<string> = pattern.notes;
    if (notes.length === 0) {
      NoteInfo.load();
      let allNotes = NoteInfo.getAllIds();
      notes = allNotes;
    }

    return notes;
  }

  addEvent(entry: FlexyGridEntry<NoteTriggerDto>, cellWidth: number, cellHeight: number, pattern: Pattern, params: TransportParams): void {

    let fullTime = MusicMath.getTimeAtBeat(pattern.length, params.bpm, params.quantization);
    let ticksPerBeat = MusicMath.getBeatTicks(params.quantization);
    let fullWidth = cellWidth * pattern.length * ticksPerBeat;
    let percentage = entry.left / fullWidth;
    let noteTime = fullTime * percentage;
    let rowIndex = entry.top / cellHeight;

    let notes = this.getPatternNotes(pattern);
    let note = notes[rowIndex];

    let trigger = new NoteTriggerDto(null, note, noteTime, NoteLength.Quarter, Loudness.fff, 0);
    entry.data = trigger;
    this.patternsService.insertNote(pattern, trigger);

    console.log(trigger);
  }

  removeEvent(entry:FlexyGridEntry<NoteTriggerDto>,pattern:Pattern):void{

    this.patternsService.removeNote(pattern, entry.data);
    entry.data=null;
  }

  /*  onNoteCellClicked(cell: Cell, pattern: Pattern): void {
      if (cell.events.length>0) {

      }
      else {
        let trigger = new NoteTriggerDto(null, cell.note, cell.position.time, NoteLength.Quarter, Loudness.fff, 0);
        cell.events.push(trigger);
        trigger.column = cell.column;
        trigger.row = cell.row;
        this.patternsService.insertNote(pattern, trigger);
      }


    }*/
  /*



  onEventCellClicked(cell: EventCell, eventCells: Array<EventCell>, pattern: Pattern): void {
    this.patternsService.removeNote(pattern, cell.note);
    let index = _.indexOf(eventCells, cell);
    eventCells.splice(index, 1);

  }

  onEventCellPositionChanged(cell: EventCell, noteCells: Array<Array<Cell>>, pattern: Pattern, transportParams: TransportParams): void {
    cell.note.time = cell.column * MusicMath.getTickTime(transportParams.bpm, transportParams.quantization);
    cell.note.note = noteCells[cell.row][0].note;
  }*/

}
