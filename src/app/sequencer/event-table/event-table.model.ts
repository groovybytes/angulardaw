import {NoteCell} from "../model/NoteCell";
import {SequencerD3Specs} from "../model/sequencer.d3.specs";
import {NoteEvent} from "../../model/mip/NoteEvent";


export class EventTableModel{
  readonly tableCells: Array<NoteCell> = [];
  readonly eventCells: Array<NoteCell> = [];
  readonly specs: SequencerD3Specs = new SequencerD3Specs();
  selectedEvent:NoteEvent;
}
