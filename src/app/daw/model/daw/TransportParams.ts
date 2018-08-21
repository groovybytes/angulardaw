import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";
import {BehaviorSubject, Subject} from "rxjs";

export class TransportParams {
  quantization: BehaviorSubject<NoteLength>;
  bpm: BehaviorSubject<number>;
  signature: BehaviorSubject<TimeSignature>;
  //signature: TimeSignature = new TimeSignature(4, 4);
  tickStart: number = 0;
  tickEnd: number = Number.MAX_VALUE;
  loop: boolean = true;
}
