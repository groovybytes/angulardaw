import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {BehaviorSubject, Subscription} from "rxjs";
import {Pad} from "../../../push/model/Pad";
import {Trigger} from "../Trigger";
import {Sample} from "../Sample";
import {PluginHost} from "./PluginHost";
import {Lang} from "../../utils/Lang";
import {EventEmitter} from "@angular/core";
import {Notes} from "../../mip/Notes";
import {ADSREnvelope} from "../../mip/ADSREnvelope";
import set = Reflect.set;
import {NoteDynamics} from "../../mip/NoteDynamics";

export abstract class AudioPlugin implements PluginHost {

  private deviceSubscription: Subscription;
  readonly pads: Array<Pad> = [];
  readonly triggers: Array<Trigger> = [];
  readonly hot: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private instanceId: string;


  constructor(protected notes: Notes, protected audioContext: AudioContext) {
    this.instanceId = Lang.guid();
  }

  destroy(): void {
    this.deviceSubscription.unsubscribe();
  }

  abstract setInputNode(node: VirtualAudioNode<AudioNode>): void;

  abstract getInputNode(): VirtualAudioNode<AudioNode>;

  abstract setOutputNode(node: VirtualAudioNode<AudioNode>): void;

  abstract getOutputNode(): VirtualAudioNode<AudioNode>;

  abstract getSample(note: string): Sample;

  //abstract stop(): void;

  /* abstract startPlay(event: SampleEventInfo): void;

   abstract stopPlay(eventId: string): void;
 */
  abstract getNotes(): Array<string>;

  abstract getId(): string;

  abstract getInfo(): PluginInfo;

  abstract load(): Promise<void>;

  abstract getPushSettingsHint(): string;

  abstract getInstrumentCategory(): InstrumentCategory;

  setInstanceId(id: string): void {
    this.instanceId = id;
  }

  getInstanceId(): string {
    return this.instanceId;
  }

  play(note: string,
       time: number,
       length: number,
       stopEvent: EventEmitter<void>,
       dynamics?: NoteDynamics,
       fadeOut?: boolean): void {

    let stopSubscription = stopEvent ? stopEvent.subscribe(() => {
      stopSubscription.unsubscribe();
      if (node) {
        if (fadeOut) {
          let stopTime = this.audioContext.currentTime + 0.5;
          gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);
          node.stop(stopTime);
        } else {
          node.stop(0);
        }
      }
    }) : null;
    let detune = 0;
    let node: AudioBufferSourceNode;
    let gainNode: GainNode;
    let sample = this.getSample(note);
    if (sample.baseNote) detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(note)) * 100;

    let adsrEnvelope = dynamics ? new ADSREnvelope(dynamics) : ADSREnvelope.default(length);
    sample.trigger(time, length, adsrEnvelope, null, detune)
      .then((result: { node: AudioBufferSourceNode, gainNode: GainNode }) => {
        node = result.node;
        gainNode = result.gainNode;
        //todo: remove event listener?
        node.addEventListener("ended", () => {
          node = null;
          if (stopSubscription) stopSubscription.unsubscribe();
        });

      });

  }


}
