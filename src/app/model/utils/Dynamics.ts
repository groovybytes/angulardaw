export class Dynamics{
  constructor(attack: number, release: number, sustain: number,detune?:number, gainCurve?:Array<number>) {
    this.attack = attack;
    this.release = release;
    this.sustain = sustain;
    this.gainCurve=gainCurve;
    this.detune=detune;
  }

  attack:number;
  release:number;
  sustain:number;
  gainCurve:Array<number>;
  detune:number;

  getGainCurve(): Float32Array {
    let gainCurve = this.gainCurve?this.gainCurve:[0.3,0.5,0.7,1.0,0.7, 0.5,0.3];
    return Float32Array.from(gainCurve, x => x + x)
  }

  public static default():Dynamics{
    return new Dynamics(0,0,4,1);
  }
}
