export class NoteDynamics {

  attackTime: number;
  decayReduction: number;
  decayTime: number;
  releaseTime: number;
  sustainTime: number;

  constructor(attackTime: number, decayReduction: number, decayTime: number, releaseTime: number, sustainTime: number) {
    this.attackTime = attackTime;
    this.decayReduction = decayReduction;
    this.decayTime = decayTime;
    this.releaseTime = releaseTime;
    this.sustainTime = sustainTime;
  }

  static default(length:number):NoteDynamics{

    if (!length || length===0) return new NoteDynamics(0.1,0,0,0,0);

    function percentage(value): number {
      return length * value / 100;
    }

    let attack = percentage(10);
    let sustain=percentage(80);
    let release=percentage(10);

    return new NoteDynamics(attack,0.1,0,release,sustain);
  }
}
