import {NoteInfo} from "../utils/NoteInfo";
import {EventEmitter} from "@angular/core";

export class Sample {
  id: string;
  baseNote: NoteInfo;


  private destination: AudioNode;
  private gainNode: GainNode;
  private node: AudioBufferSourceNode;

  constructor(id: string, private buffer: AudioBuffer, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;

  }

  setDestination(node: AudioNode): void {
    this.destination = node;
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.destination);
  }


  public trigger(time: number, length: number, startEvent?: EventEmitter<void>, detune?: number): Promise<AudioBufferSourceNode> {

    return new Promise<AudioBufferSourceNode>(((resolve, reject) => {
      if (startEvent) {
        let startSubscription = startEvent.subscribe(() => {
          startSubscription.unsubscribe();
          resolve(this._trigger(time, length, detune));
        })
      } else resolve(this._trigger(time, length, detune));
    }));


  }

  private _trigger(time: number, length: number, detune?: number): AudioBufferSourceNode {

    let sourceNode = this.node = this.context.createBufferSource();
    sourceNode.connect(this.gainNode);
    sourceNode.buffer = this.buffer;


    if (detune) sourceNode.detune.value = detune;

    sourceNode.start(this.context.currentTime+time, 0, length);
    //todo: remove event listener on destroy?
    sourceNode.addEventListener("ended", () => {
      sourceNode.disconnect();
    });

    return sourceNode;
  }

  destroy(): void {
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

  }


}
