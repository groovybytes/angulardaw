import {TimeSignature} from "../mip/TimeSignature";
import {NoteLength} from "../mip/NoteLength";
import {s} from "@angular/core/src/render3";

export class MusicMath {

  public static getTickTime(bpm: number,quantization:NoteLength): number {
    return 240/bpm*1000*quantization; //240/bpm*1000==wholenotetime
  }

  public static getBeatTicks(quantization:NoteLength):number{
    return Math.pow(quantization*4,-1);
  }
  public static getTickFor(beat:number,bar:number,quantization:NoteLength,signature:TimeSignature): number {
    let beatTicks = MusicMath.getBeatTicks(quantization);
    return bar*signature.beatUnit*beatTicks+beatTicks*beat;
  }

  public static getBarNumber(tick:number,quantization:NoteLength,signature:TimeSignature): number {
    return Math.floor(tick/MusicMath.getBeatTicks(quantization)/signature.beatUnit);
  }
  public static getBeatNumber(tick:number,quantization:NoteLength,signature:TimeSignature): number {
    return Math.floor(tick/MusicMath.getBeatTicks(quantization)%signature.beatUnit);
    //return tick*quantization*4 % signature.beatUnit;
  }
}
