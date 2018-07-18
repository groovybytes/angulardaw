import {TimeSignature} from "../mip/TimeSignature";
import {NoteLength} from "../mip/NoteLength";

export class MusicMath {

/*  public static getBeatTime(bpm: number,quantization:NoteLength): number {
    return 60 * 1000 / bpm*quantization;
  }*/

  public static getTickTime(bpm: number,quantization:NoteLength): number {
    return 240/bpm*1000*quantization; //240/bpm*1000==wholenotetime
  }

  public static getTickFor(beat:number,bar:number,signature:TimeSignature): number {
    return bar*signature.beatUnit+beat;
  }

  public static getBarNumber(tick:number,signature:TimeSignature): number {
    return Math.floor(tick/signature.beatUnit);
  }
  public static getBeatNumber(tick:number,signature:TimeSignature): number {
    return tick % signature.beatUnit;
  }

  /*public static getBeatNumber(tick: number,quantization:NoteLength, signature: TimeSignature): number {
    //let factor = Math.pow(quantization,-1);


    return tick*quantization & signature.beatUnit;
  }

  public static getBarNumber(tick: number,quantization:NoteLength, signature: TimeSignature): number {
    return Math.floor(tick*quantization / signature.barUnit);
  }*/
}
