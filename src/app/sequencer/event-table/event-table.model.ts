import {NoteCell} from "../model/NoteCell";
import {SequencerD3Specs} from "../model/sequencer.d3.specs";
import {NoteTrigger} from "../../shared/model/daw/NoteTrigger";

export class EventTableModel{
  readonly tableCells: Array<NoteCell> = [];
  readonly eventCells: Array<NoteCell> = [];
  readonly specs: SequencerD3Specs = new SequencerD3Specs();
  selectedEvent:NoteTrigger;
}
