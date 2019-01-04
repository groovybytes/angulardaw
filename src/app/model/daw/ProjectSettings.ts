import {NoteLength} from "../mip/NoteLength";
import {MetronomeSettings} from "./MetronomeSettings";

export class ProjectSettings{
  metronomeSettings:MetronomeSettings=new MetronomeSettings();
  quantizationBase=NoteLength.SixtyFourth;
}
