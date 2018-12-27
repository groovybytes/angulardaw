import {NoteInfo} from "../utils/NoteInfo";
import {ADSREnvelope} from "../mip/ADSREnvelope";
import {SampleEventInfo} from "./SampleEventInfo";
import {EventEmitter} from "@angular/core";

export class Sample {
  id: string;
  baseNote: NoteInfo;

  static onEnd:EventEmitter<{relatedEvent:SampleEventInfo,sample:Sample}>=new EventEmitter();

  private destination: AudioNode;
  private gainNode: GainNode;
  private node: AudioBufferSourceNode;
  private stopEvent:EventEmitter<void>=new EventEmitter();

  constructor(id: string, private buffer: AudioBuffer, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;

  }

  setDestination(node: AudioNode): void {
    this.destination = node;
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.destination);
  }


  public trigger(event: SampleEventInfo,wait?:Promise<void>):void {

    if (wait) wait.then(()=>this._trigger(event));
    else this._trigger(event);

  }

  private _trigger(event: SampleEventInfo):void {

    let sourceNode = this.node = this.context.createBufferSource();
    let stopSubscription = this.stopEvent.subscribe(()=>{
      sourceNode.stop(0);
      sourceNode.disconnect();
    });
    sourceNode.connect(this.gainNode);
    sourceNode.buffer = this.buffer;

    if (event.detune) sourceNode.detune.value = event.detune;
    let offset=event.getOffset?event.getOffset():event.offset;

    sourceNode.start(event.time+offset, 0, event.duration);
    sourceNode.addEventListener("ended", () => {
      stopSubscription.unsubscribe();
      sourceNode.disconnect();
      Sample.onEnd.emit({relatedEvent:event,sample:this});
    });
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


  public stop(): void {
    this.stopEvent.emit();
  }

  destroy(): void {
    this.gainNode.disconnect();
    this.gainNode = null;
  }


}
