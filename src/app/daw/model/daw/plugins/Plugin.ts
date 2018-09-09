import {PluginInfo} from "./PluginInfo";
import {WstPlugin} from "./WstPlugin";
import {VirtualAudioNode} from "../VirtualAudioNode";

export interface Plugin {
  inputNode: VirtualAudioNode<AudioNode>;
  outputNode: VirtualAudioNode<AudioNode>;

  getId(): string;

  getInfo(): PluginInfo;

  destroy(): void;

  load(): Promise<WstPlugin>;
}
