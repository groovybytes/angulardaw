import {Track} from "./Track";
import {Instrument} from "../Instrument";
import {Note} from "../theory/Note";

export class MidiTrack extends Track {

  //midiData: MidiFileTrack;
  notes:Array<Note>;
  instrument:Instrument;

}
