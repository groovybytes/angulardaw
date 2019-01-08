import {NoteLength} from "../mip/NoteLength";
import {MetronomeSettings} from "./MetronomeSettings";
import {TimeSignature} from "../mip/TimeSignature";
import {BehaviorSubject} from "rxjs";

export class ProjectSettings{
  metronomeSettings:MetronomeSettings=new MetronomeSettings();
  quantizationBase=NoteLength.SixtyFourth;
  signature:TimeSignature=new TimeSignature(4,4);
  bpm: BehaviorSubject<number> = new BehaviorSubject(120);
}
