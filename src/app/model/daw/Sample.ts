import {NoteInfo} from "../utils/NoteInfo";
import {Dynamics} from "../utils/Dynamics";
import {ADSREnvelope} from "../mip/ADSREnvelope";
import {Frequencies} from "../mip/Frequencies";

export class Sample {
  id: string;
  baseNote: NoteInfo;

  private destination:AudioNode;
  private gainNode:GainNode;

  constructor(id: string, private buffer: AudioBuffer, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;

  }

  setDestination(node:AudioNode):void{
    this.destination=node;
    this.gainNode=this.context.createGain();
    this.gainNode.connect(this.destination);
  }

  public triggerWith(offset: number, detune: number,adsr?: ADSREnvelope, duration?: number): void {

    let sourceNode = this.context.createBufferSource();
    sourceNode.connect(this.gainNode);
    sourceNode.buffer = this.buffer;
    if (detune) sourceNode.detune.value = detune;

    sourceNode.addEventListener("ended", (event) =>{
      sourceNode.disconnect();
    });
    //if (adsr) adsr.apply(gainNode, this.context.currentTime+offset);
    //gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime+offset+duration?duration:0.7);

    /*var waveArray = new Float32Array(3);
    waveArray[0] = 0.8;
    waveArray[1] = 0.5;
    waveArray[2] = 0;
    console.log(duration);

    gainNode.gain.setValueCurveAtTime(waveArray, this.context.currentTime+offset+duration-0.5,0.5);
*/

    if (adsr) adsr.apply(this.gainNode, this.context.currentTime+offset);
    sourceNode.start(this.context.currentTime + offset, 0, duration ? duration : 0.7);
  }

  public trigger(offset: number, duration?: number,): void {
    this.triggerWith(offset,0,null,duration)
   /* let sourceNode = this.context.createBufferSource();
    sourceNode.connect(this.gainNode);
    sourceNode.buffer = this.buffer;
    sourceNode.start(this.context.currentTime + offset, 0, duration ? duration : 0.7);
    sourceNode.addEventListener("ended", (event) =>{
      sourceNode.disconnect();
    });*/
  }

  destroy(): void {
      this.gainNode.disconnect();
      this.gainNode=null;
  }

}
