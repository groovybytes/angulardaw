import {Track} from "./Track";
import {TimeSignature} from "../mip/TimeSignature";


export class Project{
  //header: MidiFileHeader;
  bpm:number;
  signature:TimeSignature;
  tracks:Array<Track>=[];
}
