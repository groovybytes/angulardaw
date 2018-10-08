import {NoteTrigger} from "../daw/NoteTrigger";

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

  /*static default(): ADSREnvelope {
    return new ADSREnvelope(0.01, 0.2,0.3, 0.8, 0);
  }*/

  static fromNote(note:NoteTrigger):ADSREnvelope{
    let attack = 0.1;
    let decayReduction = 0.2;
    let decayTime = 0.1;
    let releaseTime=note.length*0.8;
    let sustainTIme=note.length*0.2;

    return new ADSREnvelope(attack,decayReduction,decayTime,releaseTime,sustainTIme);
  }
  getDuration(): number {
    return this.attackTime + this.decayTime + this.releaseTime + this.sustainTime;
  }

  apply(node: GainNode, now): void {

    node.gain.cancelScheduledValues(now);
    node.gain.setValueAtTime(0, now);
    node.gain.linearRampToValueAtTime(1, now + this.attackTime);
    let decayGain = 1 - this.decayReduction;
    node.gain.linearRampToValueAtTime(decayGain, now + this.attackTime + this.decayTime);
    node.gain.linearRampToValueAtTime(decayGain, now + this.attackTime + this.decayTime + this.sustainTime);
    node.gain.linearRampToValueAtTime(0.0001, now + this.attackTime + this.decayTime + this.sustainTime + this.releaseTime);

  }
}
