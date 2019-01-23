import {NoteDynamics} from "./NoteDynamics";

export class ADSREnvelope {
  constructor(dynamics:NoteDynamics) {
    this.attackTime = dynamics.attackTime;
    this.decayReduction = dynamics.decayReduction;
    this.decayTime = dynamics.decayTime;
    this.releaseTime = dynamics.releaseTime;
    this.sustainTime = dynamics.sustainTime;
  }

  attackTime: number;
  decayReduction: number;
  decayTime: number;
  releaseTime: number;
  sustainTime: number;

  /*static default(): ADSREnvelope {
    return new ADSREnvelope(0.01, 0.2,0.3, 0.8, 0);
  }*/


  static default(duration: number): ADSREnvelope {

    function percentage(value): number {
      return duration * value / 100;
    }

    let attack = percentage(10);
    let sustain=percentage(80);
    let release=percentage(10);

    return new ADSREnvelope(new NoteDynamics(attack, 0, 0, release, sustain));
  }

  static minimal(duration: number): ADSREnvelope {

    function percentage(value): number {
      return duration * value / 100;
    }


    let attack = 0;//percentage(10);
    let decayReduction = 0;
    let decayTime = percentage(20);
    let sustainTIme = percentage(50);
    let releaseTime = percentage(50);


    return new ADSREnvelope(new NoteDynamics(attack, decayReduction, decayTime, releaseTime, sustainTIme));
  }


  apply(node: GainNode, now, length: number): void {
    let endTime = now + this.attackTime + this.decayTime + this.sustainTime + this.releaseTime;
    /*  let endTime = now + this.attackTime + this.decayTime + this.sustainTime + this.releaseTime;
      var waveArray = new Float32Array(4);
      waveArray[0] = 1;
      waveArray[1] = 0.4;
      waveArray[2] = 0.3;
      waveArray[3] = 0.01;

      node.gain.setValueCurveAtTime(waveArray, now, length);*/

    if (!length) //happens when live playing
    {
      node.gain.cancelScheduledValues(now);
      node.gain.setValueAtTime(0, now);
      node.gain.linearRampToValueAtTime(1,now+this.attackTime);
    }
    else{
      let peakTime = now + length * 50 / 100;
      let fadeoutTime = now + length * 80 / 100;
      // Important! Setting a scheduled parameter value
      node.gain.cancelScheduledValues(now);
      node.gain.setValueAtTime(0, now);
      node.gain.setValueAtTime(1, now+this.attackTime);
      node.gain.setValueAtTime(1, now+this.attackTime+this.sustainTime);
      node.gain.exponentialRampToValueAtTime(0.0001, now+this.attackTime+this.sustainTime+this.releaseTime);
    }




    //node.gain.setTargetAtTime(0, now+length, 0.015);

  }

  /*apply(node: GainNode, now): void {
    let endTime = now + this.attackTime + this.decayTime + this.sustainTime + this.releaseTime;
    node.gain.cancelScheduledValues(now);
    node.gain.setValueAtTime(0, now);
    node.gain.linearRampToValueAtTime(1, now + this.attackTime);
    let decayGain = 1 - this.decayReduction;
    node.gain.linearRampToValueAtTime(decayGain, now + this.attackTime + this.decayTime);
    node.gain.linearRampToValueAtTime(decayGain, now + this.attackTime + this.decayTime + this.sustainTime);
    node.gain.exponentialRampToValueAtTime(0.01,now+(endTime-now)/2 );

  }*/

  log(): void {

    console.log("attack: " + this.attackTime);
    console.log("decayReduction: " + this.decayReduction);
    console.log("decayTime: " + this.decayTime);
    console.log("releaseTime: " + this.releaseTime);
    console.log("sustainTIme: " + this.sustainTime);
  }
}
