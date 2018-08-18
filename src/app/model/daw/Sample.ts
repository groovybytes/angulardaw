import {NoteInfo} from "../utils/NoteInfo";
import {Dynamics} from "../utils/Dynamics";
import {ADSREnvelope} from "../mip/ADSREnvelope";
import {Frequencies} from "../mip/Frequencies";

export class Sample {
  id: string;
  baseNote: NoteInfo;
 


  constructor(id: string, private buffer: AudioBuffer, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;
  }

  public triggerWith(adsr: ADSREnvelope,offset:number,detune:number): void {

    let sourceNode = this.context.createBufferSource();
    sourceNode.buffer = this.buffer;
    if (detune) sourceNode.detune.value=detune;
    let gainNode = this.context.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(this.context.destination);
    //adsr.apply(gainNode, this.context.currentTime);
    sourceNode.start(this.context.currentTime+offset, 0, 0.7);
  }

  public trigger(offset:number):void{
    let sourceNode = this.context.createBufferSource();
    sourceNode.buffer = this.buffer;
    let gainNode = this.context.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(this.context.destination);
    sourceNode.start(this.context.currentTime+offset, 0, 0.7);
  }

}
