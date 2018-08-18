import {Injectable} from "@angular/core";
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
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
import {NoteTriggerViewModel} from "../model/viewmodel/NoteTriggerViewModel";
import {TheoryService} from "../shared/services/theory.service";

@Injectable()
export class SequencerService {

  constructor(private patternsService: PatternsService,private theoryService:TheoryService) {


  }

  createHeaderCells(transportParams: TransportParams, pattern: PatternViewModel): Array<HeaderCell<any>> {
    let result = [];
    let beatTicks = MusicMath.getBeatTicks(transportParams.quantization.getValue());
    let nColumns = beatTicks * pattern.length;
    for (let i = 0; i < nColumns; i++) {
      let info = new HeaderCell();
      info.beat= MusicMath.getBeatNumber(i, transportParams.quantization.getValue(), transportParams.signature.getValue());
      /* if (i % beatTicks === 0) {
         info.position = new TransportPosition();
         info.position.beat = MusicMath.getBeatNumber(i, transportParams.quantization, transportParams.signature);
       }*/

      result.push(info);
    }

    return result;
  }

  createNoteCells(transportParams: TransportParams, pattern: PatternViewModel): Array<Array<ContentCell>> {
    let model = [];
    let nColumns = MusicMath.getBeatTicks(transportParams.quantization.getValue()) * pattern.length;
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

  createEntries(pattern: PatternViewModel, cellWidth: number, cellHeight: number,
                params: TransportParams): Array<FlexyGridEntry<NoteTriggerViewModel>> {
    let result = [];
    pattern.events.forEach(event => {
      let fullTime = MusicMath.getTimeAtBeat(pattern.length, params.bpm.getValue(), params.quantization.getValue());
      let tick = MusicMath.getTickForTime(event.time, params.bpm.getValue(), params.quantization.getValue());
      let ticksPerBeat = MusicMath.getBeatTicks(params.quantization.getValue());
      let percentage = event.time / fullTime;
      let fullWidth = cellWidth * pattern.length * ticksPerBeat;
      let left = fullWidth * percentage;
      let notes = this.getPatternNotes(pattern);
      let rowIndex = notes.indexOf(event.note);
      let top = rowIndex * cellHeight;

      let entry = new FlexyGridEntry(event,left,top,Math.ceil(left/cellWidth));
      result.push(entry);
    });
    return result;
  }

  private getPatternNotes(pattern: PatternViewModel): Array<string> {
    let notes: Array<string> = pattern.notes;
    if (notes.length === 0) {
      notes = this.theoryService.getAllIds();
    }

    return notes;
  }

  addEvent(entry: FlexyGridEntry<NoteTriggerViewModel>, cellWidth: number, cellHeight: number, pattern: PatternViewModel, params: TransportParams): void {

    let fullTime = MusicMath.getTimeAtBeat(pattern.length, params.bpm.getValue(), params.quantization.getValue());
    let ticksPerBeat = MusicMath.getBeatTicks(params.quantization.getValue());
    let fullWidth = cellWidth * pattern.length * ticksPerBeat;
    let percentage = entry.left / fullWidth;
    let noteTime = fullTime * percentage;
    let rowIndex = entry.top / cellHeight;

    let notes = this.getPatternNotes(pattern);
    let note = notes[rowIndex];
    let trigger = new NoteTriggerViewModel(null, note, noteTime, NoteLength.Quarter, Loudness.fff, 0);
    entry.data = trigger;
    this.patternsService.insertNote(pattern, trigger);
  }

  updateEvent(entry: FlexyGridEntry<NoteTriggerViewModel>, cellWidth: number, cellHeight: number, pattern: PatternViewModel, params: TransportParams): void {

    let fullTime = MusicMath.getTimeAtBeat(pattern.length, params.bpm.getValue(), params.quantization.getValue());
    let ticksPerBeat = MusicMath.getBeatTicks(params.quantization.getValue());
    let fullWidth = cellWidth * pattern.length * ticksPerBeat;
    let percentage = entry.left / fullWidth;
    let noteTime = fullTime * percentage;
    let notes = this.getPatternNotes(pattern);
    let rowIndex = entry.top / cellHeight;

    entry.data.column=entry.column;
    entry.data.note=notes[rowIndex];
    entry.data.time=noteTime;
  }

  removeEvent(entry:FlexyGridEntry<NoteTriggerViewModel>, pattern:PatternViewModel):void{

    this.patternsService.removeNote(pattern, entry.data.id);
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
