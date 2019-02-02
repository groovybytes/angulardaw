import {Pattern} from "./Pattern";
import {BehaviorSubject} from "rxjs";

export class RecordSession {
  pattern: Pattern;
  startTime: number = -1;
  state: BehaviorSubject<number> = new BehaviorSubject(0);
}
