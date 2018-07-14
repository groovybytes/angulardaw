export class ADSREnvelope {
  constructor(attackTime: number, decayReduction: number, decayTime: number, releaseTime: number, sustainTime: number) {
    this.attackTime = attackTime;
    this.decayReduction = decayReduction;
    this.decayTime = decayTime;
    this.releaseTime = releaseTime;
    this.sustainTime = sustainTime;
  }


  attackTime: number;
  decayReduction: number;
  decayTime: number;
  releaseTime: number;
  sustainTime: number;

  static default(): ADSREnvelope {
    return new ADSREnvelope(0.01, 0.2,0.3, 1, 1);
  }

  getDuration(): number {
    return this.attackTime + this.decayTime + this.releaseTime + this.sustainTime;
  }

  apply(node: GainNode, now): void {
    console.log(now);
    node.gain.cancelScheduledValues(now);
    node.gain.setValueAtTime(0, now);
    node.gain.linearRampToValueAtTime(1, now + this.attackTime);
    let decayGain = 1 - this.decayReduction;
    node.gain.linearRampToValueAtTime(decayGain, now + this.attackTime + this.decayTime);
    node.gain.linearRampToValueAtTime(decayGain, now + this.attackTime + this.decayTime + this.sustainTime);
    node.gain.linearRampToValueAtTime(0, now + this.attackTime + this.decayTime + this.sustainTime + this.releaseTime);

  }
}
