import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";

export class TransportParams{
  quantization:NoteLength=NoteLength.Quarter;
  bpm:number=120;
  signature:TimeSignature=new TimeSignature(4,4);
  tickStart: number = 0;
  tickEnd: number = Number.MAX_VALUE;
  loop:boolean=true;
}
