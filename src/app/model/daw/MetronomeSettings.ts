import {NoteLength} from "../mip/NoteLength";
import {BehaviorSubject} from "rxjs";
import {Pattern} from "./Pattern";

export class MetronomeSettings{
  countIn:boolean=true;
  countInBars:number=1;
  enabled:BehaviorSubject<boolean>=new BehaviorSubject(true);
  pattern: Pattern;
}
