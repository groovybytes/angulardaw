import {Track} from "./Track";
import {MidiFileHeader} from "../midi/midifilespec/MidiFileHeader";
import {TimeSignature} from "../theory/TimeSignature";

export class Project{
  //header: MidiFileHeader;
  bpm:number;
  signature:TimeSignature;
  tracks:Array<Track>=[];
}
