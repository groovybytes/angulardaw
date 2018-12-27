import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {BehaviorSubject, Subscription} from "rxjs";
import {Pad} from "../../../push/model/Pad";
import {Trigger} from "../Trigger";
import {Sample} from "../Sample";
import {PluginHost} from "./PluginHost";
import {Lang} from "../../utils/Lang";

export abstract class AudioPlugin implements PluginHost {

  private deviceSubscription: Subscription;
  readonly pads: Array<Pad> = [];
  readonly triggers: Array<Trigger> = [];
  readonly hot: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private instanceId: string;


  constructor() {
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

  abstract getInstrumentCategory(): InstrumentCategory;

  setInstanceId(id: string): void {
    this.instanceId = id;
  }

  getInstanceId(): string {
    return this.instanceId;
  }


}
