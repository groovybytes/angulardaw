import {Sample} from "../Sample";
import {InstrumentMapping} from "../../mip/instruments/drums/spec/InstrumentMapping";
import {AppConfiguration} from "../../../app.configuration";
import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {FilesApi} from "../../../api/files.api";
import {SamplesApi} from "../../../api/samples.api";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {AudioPlugin} from "./AudioPlugin";
import {Trigger} from "../Trigger";
import {TriggerSpec} from "../TriggerSpec";
import {SampleEventInfo} from "../SampleEventInfo";


export class Drums extends AudioPlugin {

  protected inputNode: VirtualAudioNode<AudioNode>;
  protected outputNode: VirtualAudioNode<AudioNode>;
  private readonly id: string;
  private samples: Array<Sample> = [];

  constructor(
    id: string,
    private fileService: FilesApi,
    private config: AppConfiguration,
    private info: PluginInfo,
    private samplesV2Service: SamplesApi
  ) {
    super();
    this.id = id;
  }


  getInfo(): PluginInfo {
    return this.info;
  }


  getNotes(): Array<string> {
    return this.triggers.map(t => t.spec.note);
  }


  destroy(): void {
    this.samples.forEach(sample => sample.destroy());
  }

  getSample(note: string): Sample {
    let trigger = this.triggers.find(trigger => trigger.spec.note === note);
    return trigger ? trigger.sample : null;
  }


  load(): Promise<void> {
    return new Promise((resolve, reject) => {

      this.fileService.getFile(this.config.getAssetsUrl("config/drums/drumkit1.json"))
        .then((config: InstrumentMapping) => {
          let promises = [];
          let urls = config.mappings.map(map => this.config.getAssetsUrl("sounds/drums/drumkit1/" + map.url));
          let promise = this.samplesV2Service.getSamples(urls);
          promises.push(promise);
          promise.then((samples: Array<Sample>) => {
            this.samples = samples;

            samples.forEach((sample, i) => {
              let spec = config.mappings[i];
              this.triggers.push(new Trigger(new TriggerSpec(spec.note, spec.instrument, spec.url), sample));
            })

          }).catch(error => reject(error));

          Promise.all(promises).then(() => resolve()).catch(error => reject(error));
        })
        .catch(error => reject(error));
    })
  }

  getId(): string {
    return this.id;
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
    this.samples.forEach(sample => sample.setDestination(node.node));
  }

  getInstrumentCategory(): InstrumentCategory {
    return InstrumentCategory.PERCUSSION;
  }

  /*startPlay(event: SampleEventInfo) {
    return this.feed(event);
  }

  stopPlay(): void {
  }*/


}
