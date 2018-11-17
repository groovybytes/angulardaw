import {PluginInfo} from "./PluginInfo";
import {WstPlugin} from "./WstPlugin";
import {VirtualAudioNode} from "../VirtualAudioNode";

export interface Plugin {

  setInputNode(node:VirtualAudioNode<AudioNode>):void;
  getInputNode():VirtualAudioNode<AudioNode>;
  setOutputNode(node:VirtualAudioNode<AudioNode>):void;
  getOutputNode():VirtualAudioNode<AudioNode>;

  getId(): string;

  getInfo(): PluginInfo;

  destroy(): void;

  load(): Promise<WstPlugin>;
}