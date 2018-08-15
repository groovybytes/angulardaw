import {NoteInfo} from "../utils/NoteInfo";
import {Dynamics} from "../utils/Dynamics";
import {ADSREnvelope} from "../mip/ADSREnvelope";
import {Frequencies} from "../mip/Frequencies";

export class Sample {
  id: string;
  baseNote: NoteInfo;
  private gainNode: GainNode;
  private sourceNode: AudioBufferSourceNode;


  constructor(id: string, private buffer: AudioBuffer, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;
  }

  public triggerWith(adsr: ADSREnvelope,detune?:number): void {

    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    if (detune) this.sourceNode.detune.value=detune;
    this.gainNode = this.context.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    adsr.apply(this.gainNode, this.context.currentTime);
    this.sourceNode.start(0, 0, 1);
  }

  public trigger():void{
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.gainNode = this.context.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.sourceNode.start(0, 0, 1);
  }

}
