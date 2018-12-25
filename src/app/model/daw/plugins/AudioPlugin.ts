import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {BehaviorSubject, Subscription} from "rxjs";
import {Pad} from "../../../push/model/Pad";
import {Trigger} from "../Trigger";
import {Sample} from "../Sample";

export abstract class AudioPlugin {

  private deviceSubscription: Subscription;
  readonly pads: Array<Pad> = [];
  readonly triggers: Array<Trigger> = [];
  readonly hot: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor() {
  }

  destroy(): void {
    this.deviceSubscription.unsubscribe();
  }

  abstract setInputNode(node: VirtualAudioNode<AudioNode>): void;

  abstract getInputNode(): VirtualAudioNode<AudioNode>;

  abstract setOutputNode(node: VirtualAudioNode<AudioNode>): void;

  abstract getOutputNode(): VirtualAudioNode<AudioNode>;

  abstract getSample(note:string):Sample;

  //abstract stop(): void;

 /* abstract startPlay(event: SampleEventInfo): void;

  abstract stopPlay(eventId: string): void;
*/
  abstract getNotes(): Array<string>;

  abstract getId(): string;

  abstract getInfo(): PluginInfo;

  abstract load(): Promise<void>;

  abstract getInstrumentCategory(): InstrumentCategory;
}
