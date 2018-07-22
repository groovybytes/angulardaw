import {MidiFileHeader} from "./MidiFileHeader";
import {MidiFileTrack} from "./MidiFileTrack";


export class MidiFile {
  header: MidiFileHeader;
  startTime: number;
  duration: number;
  tracks: MidiFileTrack[];
}
