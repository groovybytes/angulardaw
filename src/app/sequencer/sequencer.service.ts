import {Inject, Injectable} from "@angular/core";
import {MusicMath} from "../model//utils/MusicMath";
import {Loudness} from "../model//mip/Loudness";
import {Pattern} from "../model//daw/Pattern";
import {NoteCell} from "./model/NoteCell";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {TimeSignature} from "../model//mip/TimeSignature";
import {Notes} from "../model/mip/Notes";
import {NoteEvent} from "../model/mip/NoteEvent";


@Injectable()
export class SequencerService {

  constructor(@Inject("Notes") private notes: Notes) {


  }


  createTableCells(pattern: Pattern, specs: SequencerD3Specs): Array<NoteCell> {
    let model: Array<NoteCell> = [];
    let nColumns = MusicMath.getBeatTicks(pattern.quantization.getValue()) * pattern.length;

    specs.rows = pattern.triggers.length;
    specs.columns = nColumns;
    let tickTime = MusicMath.getTickTime(pattern.transportContext.settings.global.bpm, pattern.quantization.getValue());

    // create header cells
    for (let j = 0; j < nColumns; j++) {
      let cell = new NoteCell((j + 1) * specs.cellWidth, 0, specs.cellWidth, specs.cellHeight);
      cell.header = true;
      cell.beat = MusicMath.getBeatNumber(j, pattern.quantization.getValue(),pattern.transportContext.settings.global.beatUnit);
      cell.tick = j;
      cell.row = 0;
      cell.column = j + 1;
      cell.time = tickTime * j;
      model.push(cell);
    }

    // create body cells
    for (let i = 0; i < pattern.triggers.length; i++) {
      specs.rows++;
      for (let j = 0; j < nColumns; j++) {
        let cell = new NoteCell((j + 1) * specs.cellWidth, (i + 1) * specs.cellHeight, specs.cellWidth, specs.cellHeight);
        cell.tick = j;
        cell.row = i + 1;
        cell.column = j + 1;
        cell.trigger = pattern.triggers[i];
        cell.time = tickTime * j;
        model.push(cell);
      }
    }

    // create row header cells
    for (let i = 0; i < pattern.triggers.length; i++) {
      let cell = new NoteCell(0, (i + 1) * specs.cellHeight, specs.cellWidth, specs.cellHeight);
      cell.tick = -1;
      cell.row = i + 1;
      cell.column = 0;
      cell.trigger = pattern.triggers[i];
      model.push(cell);
    }


    return model;

  }

  createEventCells(pattern: Pattern, specs: SequencerD3Specs): Array<NoteCell> {
    let model: Array<NoteCell> = [];
    let nColumns = MusicMath.getBeatTicks(pattern.quantization.getValue()) * pattern.length;

    //create event cells
    pattern.events.forEach(event => {
      let cell = this.createEventCell(event, pattern, specs, nColumns);
      if (cell) model.push(cell);
    });

    return model;

  }

  addNote(row: number, column: number, cells: Array<NoteCell>, specs: SequencerD3Specs, pattern: Pattern): void {

    let x = column * specs.cellWidth;
    let y = row * specs.cellHeight;
    let cell = new NoteCell(x, y, specs.cellWidth, specs.cellHeight);
    let noteTime = this.getTimeForXPosition(x, specs, pattern);//fullTime * percentage;
    let rowIndex = cell.y / specs.cellHeight;
    let notes = pattern.getNotes();
    let note = notes[rowIndex - 1];
    let noteLength = this.getNoteLength(specs.cellWidth, pattern, specs);
    let trigger = new NoteEvent(note, noteTime, noteLength, Loudness.fff, 0);
    this.initializeNoteCell(rowIndex, cell, trigger, pattern);
    cells.push(cell);

    pattern.insertNote(trigger);
  }

  addCellWithNote(note: NoteEvent, cells: Array<NoteCell>, specs: SequencerD3Specs, pattern: Pattern): void {

    let nColumns = MusicMath.getBeatTicks(pattern.quantization.getValue()) * pattern.length;
    let cell = this.createEventCell(note, pattern, specs, nColumns);
    if (cell) cells.push(cell);
  }

  removeEvent(cells: Array<NoteCell>, entry: NoteCell, pattern: Pattern): void {
    pattern.removeNote(entry.data.id);
    entry.data = null;
    let cellIndex = cells.findIndex(cell => cell.id === entry.id);
    cells.splice(cellIndex, 1);
  }

  setCellXPosition(cell: NoteCell, x: number, specs: SequencerD3Specs, pattern: Pattern): void {
    let widthDelta = specs.cellWidth - cell.width;
    if (x <= specs.cellWidth) cell.x = specs.cellWidth;
    else if (x >= (specs.cellWidth * specs.columns) + widthDelta) cell.x = specs.cellWidth * specs.columns + widthDelta;
    else cell.x = x;

    cell.time = cell.data.time = this.getTimeForXPosition(cell.x, specs, pattern);

  }

  setCellYPosition(cell: NoteCell, row: number, specs: SequencerD3Specs, pattern: Pattern): void {
    cell.trigger.note = pattern.triggers[row - 1].note;
    cell.data.note = cell.trigger.note;
    cell.row = row;
    cell.y = specs.cellHeight * row;

  }

  setCellNoteLength(cell: NoteCell, specs: SequencerD3Specs, pattern: Pattern): void {
    cell.data.length = this.getNoteLength(cell.width, pattern, specs);
  }

  moveCell(sourceCell: NoteCell, targetCell: NoteCell): void {
    if (targetCell && targetCell.row >= 0 && targetCell.column >= 0) {
      sourceCell.applyAttributesFrom(targetCell);
      sourceCell.data.note = sourceCell.trigger.note;
      sourceCell.data.time = sourceCell.time;
    }

  }


  private createEventCell(event: NoteEvent, pattern: Pattern, specs: SequencerD3Specs, nColumns): NoteCell {
    let eventTick = MusicMath.getTickForTime(event.time, pattern.transportContext.settings.global.bpm, pattern.quantization.getValue());

    if (eventTick < nColumns) {
      let left = this.getXPositionForTime(event.time, specs, pattern);
      let notes = pattern.getNotes();
      let rowIndex = notes.findIndex(note=>note===event.note) + 1;
      let top = (rowIndex) * specs.cellHeight;

      let width = this.getEventWidth(event.length, pattern, specs);
      let cell = new NoteCell(left, top, width, specs.cellHeight);
      this.initializeNoteCell(rowIndex, cell, event, pattern);

      return cell;
    }

    return null;
  }

  private initializeNoteCell(rowIndex: number, cell: NoteCell, event: NoteEvent, pattern: Pattern): void {
    cell.tick = MusicMath.getTickForTime(event.time, pattern.transportContext.settings.global.bpm, pattern.quantization.getValue());
    //let rowIndex = pattern.notes.indexOf(event.note);
    cell.row = rowIndex;
    cell.data = event;
    cell.column = cell.tick;
    cell.trigger = pattern.triggers[rowIndex];
    cell.time = event.time;
  }

  private getXPositionForTime(time: number, specs: SequencerD3Specs, pattern: Pattern): number {
    let fullTime = MusicMath.getTimeAtBeat(pattern.length, 120, pattern.quantization.getValue());
    let percentage = time / fullTime;
    let fullWidth = specs.cellWidth * specs.columns;
    return (fullWidth * percentage) + specs.cellWidth;

  }

  private getTimeForXPosition(x: number, specs: SequencerD3Specs, pattern: Pattern): number {
    let fullTime = MusicMath.getTimeAtBeat(pattern.length, pattern.transportContext.settings.global.bpm, pattern.quantization.getValue());
    let ticksPerBeat = MusicMath.getBeatTicks(pattern.quantization.getValue());
    let fullWidth = specs.cellWidth * pattern.length * ticksPerBeat;
    let percentage = (x - specs.cellWidth) / fullWidth;

    let noteTime = fullTime * percentage;

    return noteTime;

  }

  private getEventWidth(noteLength: number, pattern: Pattern, specs: SequencerD3Specs): number {
    let fullTime = MusicMath.getTimeAtBeat(pattern.length, pattern.transportContext.settings.global.bpm, pattern.quantization.getValue());
    let fullWidth = specs.cellWidth * specs.columns;
    return fullWidth * ((noteLength * 120 / pattern.transportContext.settings.global.bpm) / fullTime);//  timePerPixel * noteLength*120/transport.getBpm();
  }

  private getNoteLength(width: number, pattern: Pattern, specs: SequencerD3Specs): number {
    let fullTime = MusicMath.getTimeAtBeat(pattern.length, 120, pattern.quantization.getValue());

    let fullWidth = specs.cellWidth * specs.columns;
    let timePerPixel = fullTime / fullWidth;

    return timePerPixel * width;
  }


  /* onEventCellPositionChanged(cell: NoteCell, noteCells: Array<Array<Cell>>, pattern: Pattern, transportParams: TransportParams): void {
     cell.note.time = cell.column * MusicMath.getTickTime(transportParams.bpm, transportParams.quantization);
     cell.note.note = noteCells[cell.row][0].note;
   }*/
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


/*
dragStart(cell: NoteCell, container): void {
  d3.select("#sequencer-svg #" + cell.id)["moveToFront"]();
}

drag(cell: NoteCell, cells: Array<NoteCell>, mergeSelection): void {
  d3.select("#sequencer-svg #" + cell.id)
  .attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
let dragOverCells = this.getDragOverCells(cells);
if (dragOverCells.length > 0) {
  dragOverCells.forEach(cell => {
    mergeSelection.classed("drag-over", (d: NoteCell) => d.id === cell.id);
  })

  //d3.select("#sequencer-svg #" + dragOverCell.id).classed("drag-over", true)
}
}

dragEnd(cell: NoteCell, cells: Array<NoteCell>, mergeSelection, pattern: Pattern, specs: SequencerD3Specs): void {
  let dragOverCell = this.getDragOverCells(cells)[0];
if (dragOverCell) {
  mergeSelection.classed("drag-over", false);
  cell.applyAttributesFrom(dragOverCell);
  cell.data.note = cell.note;
  cell.data.time = cell.time;
}
}


onDrop(event: MouseTrapDragEvent, cells: Array<NoteCell>): { source: NoteCell, target: NoteCell } {
  $(event.target).removeClass("drag-target");
  let data = JSON.parse(event.dataTransfer.getData("text"));
  if (data.command === "cell") {
    let sourceCell = cells.find(cell => cell.id === data.id);
    let targetCell = cells.find(cell => cell.id === $(event.target).attr("data-id"));

    return {source: sourceCell, target: targetCell};
  }
}

onResized(cell: NoteCell, pattern: Pattern, specs: SequencerD3Specs): void {


  let time = this.getTimeForXPosition(cell.x, specs, pattern);
cell.data.length = this.getNoteLength(cell.width, pattern, specs);
cell.time = time;
cell.data.time = time;


}*/


/*private getDragOverCells(cells: Array<NoteCell>): Array<NoteCell> {
  return cells.filter(cell => {
    return cell.header === false &&
      ((cell.x < d3.event.x + cell.width) && cell.x > d3.event.x) &&
      ((cell.y >= d3.event.y) && cell.y <= d3.event.y + cell.height);
  });
}*/
