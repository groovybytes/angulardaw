import {MidiFileNote} from "./MidiFileNote";
import {MidiFileControlChanges} from "./MidiFileControlChanges";

export class MidiFileTrack{
  startTime: number;
  duration: number;
  length: number;
  notes: MidiFileNote[];
  controlChanges: MidiFileControlChanges;
  id: number;
  name: string;
  instrumentNumber?: number;
  instrument: string;
  instrumentFamily: string;
  channelNumber?: number;
  isPercussion?: boolean;
}
