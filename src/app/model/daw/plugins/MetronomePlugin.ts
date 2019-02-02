import {Sample} from "../Sample";
import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {SamplesApi} from "../../../api/samples.api";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {AudioPlugin} from "./AudioPlugin";
import {PluginId} from "./PluginId";
import {Notes} from "../../mip/Notes";
import {NoteEvent} from "../../mip/NoteEvent";
import {EventEmitter} from "@angular/core";


export class MetronomePlugin extends AudioPlugin {

  private inputNode: VirtualAudioNode<AudioNode>;
  private outputNode: VirtualAudioNode<AudioNode>;
  private accentSample: Sample;
  private otherSample: Sample;

  constructor(
    protected audioContext: AudioContext,
    private samplesV2Service: SamplesApi,
    protected notes: Notes) {
    super(notes, audioContext);
  }


  destroy(): void {
    this.accentSample.destroy();
    this.otherSample.destroy();
  }


  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.samplesV2Service.getClickSamples().then(result => {
        this.accentSample = result.accentSample;
        this.otherSample = result.defaultSample;
        resolve();
      })
        .catch(error => reject(error));
    })
  }

  getSample(note: string): Sample {
    if (note === "A0") return this.accentSample;
    else return this.otherSample;

  }


  getId(): string {
    return "metronome";
  }

  getNotes(): Array<string> {
    return [];
  }

  getInfo(): PluginInfo {
    let info = new PluginInfo();
    info.id = PluginId.METRONOME;
    info.category = "system";
    return info;
  }

  getInputNode(): VirtualAudioNode<AudioNode> {
    return this.inputNode;
  }

  getOutputNode(): VirtualAudioNode<AudioNode> {
    return this.outputNode;
  }

  setInputNode(node: VirtualAudioNode<AudioNode>): void {
    this.inputNode = node;
  }

  setOutputNode(node: VirtualAudioNode<AudioNode>): void {
    this.outputNode = node;
    this.accentSample.setDestination(node.node);
    this.otherSample.setDestination(node.node);
  }

  getInstrumentCategory(): InstrumentCategory {
    return InstrumentCategory.OTHER;
  }

  getPushSettingsHint(): string {
    return "default";
  }


}
