import {Track} from "./Track";
import {Instrument} from "../Instrument";
import {NoteInfo} from "../utils/NoteInfo";

export class MidiTrack extends Track {

  //midiData: MidiFileTrack;
  notes:Array<NoteInfo>;
  instrument:Instrument;

}
