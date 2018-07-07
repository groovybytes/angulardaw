export class Dynamics{
  constructor(attack: number, release: number, sustain: number, gain: number) {
    this.attack = attack;
    this.release = release;
    this.sustain = sustain;
    this.gain = gain;
  }
  attack:number;
  release:number;
  sustain:number;
  gain:number;

  getGainCurve(): Float32Array {
    return Float32Array.from([0.3,0.5,0.7,1.0,0.7, 0.5,0.3], x => x + x)
  }

  public static default():Dynamics{
    return new Dynamics(0,0,4,1);
  }
}
