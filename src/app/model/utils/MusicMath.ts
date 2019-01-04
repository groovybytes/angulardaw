import {TimeSignature} from "../mip/TimeSignature";
import {NoteLength} from "../mip/NoteLength";
import {s} from "@angular/core/src/render3";
import {NoteEvent} from "../mip/NoteEvent";

export class MusicMath {

  public static getTickTime(bpm: number, quantization: NoteLength): number {
    return 240 / bpm * 1000 * quantization; //240/bpm*1000==wholenotetime
  }

  /* public static getBeatTime(bpm: number, quantization: NoteLength): number {
     return MusicMath.getBeatTicks(quantization) * MusicMath.getTickTime(bpm, quantization);
   }*/

  public static getBeatTime(bpm: number): number {
    return 60000 / bpm;
  }

  /* public static getNoteLength(bpm: number,length:NoteLength): number {
       return 240/bpm*1000*quantization; //240/bpm*1000==wholenotetime
     }*/


  public static getBeatTicks(quantization: NoteLength): number {
    return Math.pow(quantization * 4, -1);
  }

  public static getBeatsForDuration(bpm: number, duration: number): number {
    return Math.ceil(duration / (MusicMath.getBeatTime(bpm) / 1000));
  }

  public static getNoteEventTriggerTime(startTime: number, eventTime: number, loopLength: number, currentLoop: number, bpm: number): number {
    let bpmFactor = 120 / bpm;
    return startTime + eventTime / 1000 * bpmFactor + (loopLength * bpmFactor * currentLoop);
  }




  public static getTick(tick: number, baseQuantization: NoteLength, quantization: NoteLength, loopTicks): number {
    let i = 1 / baseQuantization;
    let j = 1 / quantization;

    return Math.floor((tick / i * j) % loopTicks);
  }


  public static getBarTicks(quantization: NoteLength, beatUnit: number, bars?: number): number {
    return MusicMath.getBeatTicks(quantization) * beatUnit * bars ? bars : 1;
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

  public static getBarNumber(time: number, bpm: number, quantization: NoteLength, beatUnit: number): number {
    let tick = MusicMath.getTickForTime(time, bpm, quantization);
    return Math.floor(tick / MusicMath.getBeatTicks(quantization) / beatUnit);
  }

  public static getBeatNumberWithTime(time: number, bpm: number, quantization: NoteLength, signature: TimeSignature): number {
    let beatTicks = MusicMath.getBeatTicks(quantization);
    let tick = MusicMath.getTickForTime(time, bpm, quantization);
    if (tick % beatTicks != 0) return -1;
    return Math.floor(tick / beatTicks % signature.beatUnit);
    //return tick*quantization*4 % signature.beatUnit;
  }

  public static getBeatNumber(tick: number, quantization: NoteLength, beatUnit: number): number {
    let beatTicks = MusicMath.getBeatTicks(quantization);
    //if (tick % beatTicks != 0) return -1;
    return Math.floor(tick / beatTicks % beatUnit);
    //return tick*quantization*4 % signature.beatUnit;
  }

  public static getLength(bars: number, bpm: number, beatUnit: number): number {

    let beatTime = MusicMath.getBeatTime(bpm);
    return beatUnit * bars * beatTime;
  }

  public static getStartTime(loopStart: number, bpm: number): number {
    return loopStart * MusicMath.getBeatTime(bpm);
  }

  public static getLoopLength(beats: number, bpm: number): number {
    return beats * MusicMath.getBeatTime(bpm) / 1000;
  }

 /* public static getLoopTime(audioTimeStart: number, audioTimeCurrent: number, loopLength: number,bpm:number): number {
    return (audioTimeCurrent - audioTimeStart) % loopLength;
  }*/


}
