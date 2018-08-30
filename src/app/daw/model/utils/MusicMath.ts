import {TimeSignature} from "../mip/TimeSignature";
import {NoteLength} from "../mip/NoteLength";
import {s} from "@angular/core/src/render3";

export class MusicMath {

  public static getTickTime(bpm: number, quantization: NoteLength): number {
    return 240 / bpm * 1000 * quantization; //240/bpm*1000==wholenotetime
  }

 /* public static getBeatTime(bpm: number, quantization: NoteLength): number {
    return MusicMath.getBeatTicks(quantization) * MusicMath.getTickTime(bpm, quantization);
  }*/

  public static getBeatTime(bpm: number): number {
    return 60000/bpm;
  }

  /* public static getNoteLength(bpm: number,length:NoteLength): number {
       return 240/bpm*1000*quantization; //240/bpm*1000==wholenotetime
     }*/


  public static getBeatTicks(quantization: NoteLength): number {
    return Math.pow(quantization * 4, -1);
  }

  public static getBarTicks(quantization: NoteLength, signature: TimeSignature): number {
    return MusicMath.getBeatTicks(quantization) * signature.beatUnit;
  }

  public static getTickFor(beat: number, bar: number, quantization: NoteLength, signature: TimeSignature): number {
    let beatTicks = MusicMath.getBeatTicks(quantization);
    return bar * signature.beatUnit * beatTicks + beatTicks * beat;
  }

  public static getTickForTime(time: number, bpm: number, quantization: NoteLength): number {
    let tickTime = MusicMath.getTickTime(bpm, quantization);
    return Math.floor(time / tickTime);
  }

  public static getTimeAtBeat(beat: number, bpm: number, quantization: NoteLength): number {
    let tickTime = MusicMath.getTickTime(bpm, quantization);
    let beatTicks = MusicMath.getBeatTicks(quantization);
    return beat * beatTicks * tickTime;
  }

  public static getBarNumber(tick: number, quantization: NoteLength, signature: TimeSignature): number {
    return Math.floor(tick / MusicMath.getBeatTicks(quantization) / signature.beatUnit);
  }

  public static getBeatNumber(tick: number, quantization: NoteLength, signature: TimeSignature): number {
    let beatTicks = MusicMath.getBeatTicks(quantization);
    if (tick % beatTicks != 0) return -1;
    return Math.floor(tick / beatTicks % signature.beatUnit);
    //return tick*quantization*4 % signature.beatUnit;
  }

  public static getStartTime(loopStart: number, bpm: number): number {
    return loopStart * MusicMath.getBeatTime(bpm);
  }

  public static getEndTime(loopEnd: number, bpm: number): number {
    return loopEnd * MusicMath.getBeatTime(bpm);
  }
}
