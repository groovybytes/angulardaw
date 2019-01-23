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
}
