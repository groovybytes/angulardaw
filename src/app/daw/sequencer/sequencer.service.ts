import {ElementRef, Injectable} from "@angular/core";
import {MusicMath} from "../model/utils/MusicMath";
import {Loudness} from "../model/mip/Loudness";
import {NoteLength} from "../model/mip/NoteLength";
import {TheoryService} from "../shared/services/theory.service";
import {Pattern} from "../model/daw/Pattern";
import {NoteTrigger} from "../model/daw/NoteTrigger";
import {TracksService} from "../shared/services/tracks.service";
import {NoteCell} from "./model/NoteCell";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {WindowSpecs} from "../model/daw/visual/WindowSpecs";
import {TransportReader} from "../model/daw/transport/TransportReader";

@Injectable()
export class SequencerService {

  constructor(private theoryService: TheoryService, private trackService: TracksService) {


  }

  /*createHeaderCells(transportParams: TransportParams, pattern: Pattern): Array<HeaderCell> {
    let result = [];
    let beatTicks = MusicMath.getBeatTicks(transportParams.quantization.getValue());
    let nColumns = beatTicks * pattern.length;
    for (let i = 0; i < nColumns; i++) {
      let info = new HeaderCell();
      info.beat= MusicMath.getBeatNumber(i, transportParams.quantization.getValue(), transportParams.signature.getValue());
      /!* if (i % beatTicks === 0) {
         info.position = new TransportPosition();
         info.position.beat = MusicMath.getBeatNumber(i, transportParams.quantization, transportParams.signature);
       }*!/

      result.push(info);
    }

    return result;
  }*/

  createCells(pattern: Pattern, transport:TransportReader, specs: SequencerD3Specs): Array<NoteCell> {
    let model = [];
    let nColumns = MusicMath.getBeatTicks(transport.getQuantization()) * pattern.length;

    specs.rows = pattern.notes.length;
    specs.columns = nColumns;

    for (let j = 0; j < nColumns; j++) {
      let cell = new NoteCell(j * specs.cellWidth, 0, specs.cellWidth, specs.cellHeight);
      cell.header = true;
      cell.beat = MusicMath.getBeatNumber(j, transport.getQuantization(), transport.getSignature());
      model.push(cell);
    }

    for (let i = 0; i < pattern.notes.length; i++) {
      specs.rows++;
      for (let j = 0; j < nColumns; j++) {
        let cell = new NoteCell(j * specs.cellWidth, (i + 1) * specs.cellHeight, specs.cellWidth, specs.cellHeight);
        model.push(cell);
      }
    }

    pattern.events.forEach(event => {

      let left = this.getXPositionForTime(event.time, specs, pattern, transport);
      let notes = pattern.notes;
      let rowIndex = notes.indexOf(event.note);
      let top = (rowIndex + 1) * specs.cellHeight;

      let cell = new NoteCell(left, top, specs.cellWidth, specs.cellHeight);
      cell.data = event;
      model.push(cell);
    });

    return model;

  }

  getXPositionForTime(time: number, specs: SequencerD3Specs, pattern: Pattern,transport:TransportReader): number {
    let fullTime = MusicMath.getTimeAtBeat(pattern.length, transport.getBpm(), transport.getQuantization());
    let percentage = time / fullTime;
    let ticksPerBeat = MusicMath.getBeatTicks(transport.getQuantization());
    let fullWidth = specs.cellWidth * pattern.length * ticksPerBeat;
    return fullWidth * percentage;

  }

  initializeWindow(element: ElementRef, specs: WindowSpecs): void {
    if (!specs.x) {
      specs.x = $(element).position().left;
      specs.y = $(element).position().top;
      specs.width = $(element).width();
      specs.height = $(element).height();
    }
    $(element).draggable({
      handle: ".card-header",
      drag: (event, ui) => {
        specs.x = ui.position.left;
        specs.y = ui.position.top;
      }
    });
    $(element).resizable({
      resize: (event, ui) => {
        specs.width = ui.size.width;
        specs.height = ui.size.height;
      },
      handles: "n, e, s, w"
    });
  }

  updateWindow(element: ElementRef, specs: WindowSpecs): void {


  }

  addNote(x: number, y: number, cells: Array<NoteCell>, specs: SequencerD3Specs, pattern: Pattern, transport:TransportReader): void {
    let cell = new NoteCell(x, y, specs.cellWidth, specs.cellHeight);
    let fullTime = MusicMath.getTimeAtBeat(pattern.length, transport.getBpm(), transport.getQuantization());
    let ticksPerBeat = MusicMath.getBeatTicks(transport.getQuantization());
    let fullWidth = specs.cellWidth * pattern.length * ticksPerBeat;
    let percentage = cell.x / fullWidth;
    let noteTime = fullTime * percentage;
    let rowIndex = cell.y / specs.cellHeight;
    let notes = pattern.notes;
    let note = notes[rowIndex - 1];
    let trigger = new NoteTrigger(null, note, noteTime, NoteLength.Quarter, Loudness.fff, 0);
    cell.data = trigger;
    cells.push(cell);
    this.trackService.insertNote(pattern, trigger);
  }

  updateEvent(entry: NoteCell, specs: SequencerD3Specs, pattern: Pattern,transport:TransportReader): void {

    let fullTime = MusicMath.getTimeAtBeat(pattern.length,transport.getBpm(),transport.getQuantization());
    let ticksPerBeat = MusicMath.getBeatTicks(transport.getQuantization());
    let fullWidth = specs.cellWidth * pattern.length * ticksPerBeat;
    let percentage = entry.x / fullWidth;
    let noteTime = fullTime * percentage;
    let notes = pattern.notes;
    let rowIndex = entry.y / specs.cellHeight;

    entry.data.note = notes[rowIndex];
    entry.data.time = noteTime;
  }

  removeEvent(entry: NoteCell, pattern: Pattern): void {

    this.trackService.removeNote(pattern, entry.data.id);
    entry.data = null;
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
