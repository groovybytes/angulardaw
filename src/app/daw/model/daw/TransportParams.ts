import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";
import {BehaviorSubject, Subject} from "rxjs";

export class TransportParams {
  quantization: BehaviorSubject<NoteLength>=new BehaviorSubject<NoteLength>(NoteLength.Quarter);
  bpm: BehaviorSubject<number>=new BehaviorSubject<number>(120);
  signature: BehaviorSubject<TimeSignature>=new BehaviorSubject<TimeSignature>(new TimeSignature(4,4));
  loopStart: BehaviorSubject<number>=new BehaviorSubject(0);//beats
  loopEnd:  BehaviorSubject<number>=new BehaviorSubject<number>(0);//beats
  loop: BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
}
