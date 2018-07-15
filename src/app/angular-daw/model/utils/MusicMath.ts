import {TimeSignature} from "../mip/TimeSignature";

export class MusicMath {

  public static getBeatTime(bpm: number): number {
    return 60 * 1000 / bpm;
  }

  public static getBeatNumber(tick: number, signature: TimeSignature): number {
    return Math.floor(tick % signature.beatUnit)
  }
  public static getBarNumber(tick: number, signature: TimeSignature): number {
    return Math.floor(tick / signature.barUnit)
  }
}
