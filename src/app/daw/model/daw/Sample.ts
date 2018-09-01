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

  public triggerWith(offset:number,detune:number,adsr?: ADSREnvelope,duration?:number,destination?:AudioNode): void {

    let sourceNode = this.context.createBufferSource();
    sourceNode.buffer = this.buffer;
    if (detune) sourceNode.detune.value=detune;
    let gainNode = this.context.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(destination?destination:this.context.destination);
    //if (adsr) adsr.apply(gainNode, this.context.currentTime+offset);
    gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime+offset+duration);

    /*var waveArray = new Float32Array(3);
    waveArray[0] = 0.8;
    waveArray[1] = 0.5;
    waveArray[2] = 0;
    console.log(duration);

    gainNode.gain.setValueCurveAtTime(waveArray, this.context.currentTime+offset+duration-0.5,0.5);
*/
    sourceNode.start(this.context.currentTime+offset, 0, duration?duration:0.7);
  }

  public trigger(offset:number,duration?:number,destination?:AudioNode):void{
    let sourceNode = this.context.createBufferSource();
    sourceNode.buffer = this.buffer;
    let gainNode = this.context.createGain();
    sourceNode.connect(gainNode);
    gainNode.connect(destination?destination:this.context.destination);
    sourceNode.start(this.context.currentTime+offset, 0, duration?duration:0.7);
  }

}
