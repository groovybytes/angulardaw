import {NoteInfo} from "../utils/NoteInfo";
import {EventEmitter} from "@angular/core";
import {ADSREnvelope} from "../mip/ADSREnvelope";

export class Sample {
  id: string;
  baseNote: NoteInfo;


  private destination: AudioNode;
  private node: AudioBufferSourceNode;
  buffer: AudioBuffer;

  constructor(id: string, buffer: AudioBuffer, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;

  }

  setDestination(node: AudioNode): void {
    this.destination = node;
  }


  public trigger(time: number, length: number, adsr: ADSREnvelope, startEvent?: EventEmitter<void>, detune?: number): Promise<{node:AudioBufferSourceNode,gainNode:GainNode}> {

    return new Promise<{node:AudioBufferSourceNode,gainNode:GainNode}>(((resolve, reject) => {
      if (startEvent) {
        let startSubscription = startEvent.subscribe(() => {
          startSubscription.unsubscribe();
          resolve(this._trigger(time, length, adsr, detune));
        })
      } else resolve(this._trigger(time, length, adsr, detune));
    }));


  }

  private _trigger(time: number, length: number, adsr: ADSREnvelope, detune?: number): {node:AudioBufferSourceNode,gainNode:GainNode} {

    let sourceNode = this.node = this.context.createBufferSource();
    sourceNode.buffer = this.buffer;
    let gainNode = this.context.createGain();
    gainNode.connect(this.destination);
    sourceNode.connect(gainNode);

    if (detune) sourceNode.detune.value = detune;
    if (adsr) {
      adsr.apply(gainNode, time,length);
    }
    else sourceNode.connect(gainNode);

    sourceNode.start(time, 0, length);
    //todo: remove event listener on destroy?
    sourceNode.addEventListener("ended", () => {
      sourceNode.disconnect();
      sourceNode = null;
      gainNode.disconnect();
      gainNode=null;
    });

    return {node:sourceNode,gainNode:gainNode};
  }

  destroy(): void {
    console.warn("currently we do nothing here");

  }


}

/* public trigger(offset: number, duration?: number,): void {
    this.triggerWith(offset, 0, null, duration)
    /!* let sourceNode = this.context.createBufferSource();
     sourceNode.connect(this.gainNode);
     sourceNode.buffer = this.buffer;
     sourceNode.start(this.context.currentTime + offset, 0, duration ? duration : 0.7);
     sourceNode.addEventListener("ended", (event) =>{
       sourceNode.disconnect();
     });*!/
  }
  public start(offset: number, detune: number, adsr?: ADSREnvelope): AudioBufferSourceNode {
    let sourceNode =  this.context.createBufferSource();
    sourceNode.connect(this.gainNode);
    sourceNode.buffer = this.buffer;
    if (detune) sourceNode.detune.value = detune;
    //if (adsr) adsr.apply(this.gainNode, this.context.currentTime+offset);
    sourceNode.start(this.context.currentTime + offset, 0);
    sourceNode.addEventListener("ended", (event) => {
      sourceNode.disconnect();
    });
    return sourceNode;
  }
  public triggerWith(offset: number, detune: number, adsr?: ADSREnvelope, duration?: number): void {
    let sourceNode = this.context.createBufferSource();
    sourceNode.connect(this.gainNode);
    sourceNode.buffer = this.buffer;
    if (detune) sourceNode.detune.value = detune;
    if (adsr) adsr.apply(this.gainNode, this.context.currentTime + offset);
    sourceNode.start(this.context.currentTime + offset, 0, duration);
    sourceNode.addEventListener("ended", (event) => {
      sourceNode.disconnect();
    });
    //if (adsr) adsr.apply(gainNode, this.context.currentTime+offset);
    //gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime+offset+duration?duration:0.7);
    /!*var waveArray = new Float32Array(3);
    waveArray[0] = 0.8;
    waveArray[1] = 0.5;
    waveArray[2] = 0;
    console.log(duration);
    gainNode.gain.setValueCurveAtTime(waveArray, this.context.currentTime+offset+duration-0.5,0.5);
*!/
  }*/
