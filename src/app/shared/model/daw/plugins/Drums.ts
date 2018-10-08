import {Sample} from "../Sample";
import {WstPlugin} from "./WstPlugin";
import {InstrumentMapping} from "../../mip/instruments/drums/spec/InstrumentMapping";

import {AppConfiguration} from "../../../../app.configuration";
import {NoteTrigger} from "../NoteTrigger";
import {PluginInfo} from "./PluginInfo";
import {Instrument} from "./Instrument";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {FilesApi} from "../../../../api/files.api";
import {SamplesApi} from "../../../../api/samples.api";


export class Drums extends Instrument implements WstPlugin {

  protected inputNode: VirtualAudioNode<AudioNode>;
  protected outputNode: VirtualAudioNode<AudioNode>;
  private readonly id: string;
  private samples:Array<Sample>=[];

  constructor(
    id:string,
    private fileService: FilesApi,
    private config: AppConfiguration,
    private info: PluginInfo,
    private samplesV2Service: SamplesApi
  ) {
    super();
    this.id=id;
  }

  private triggers: Array<{ note: string, sample: Sample }> = [];

  getInfo(): PluginInfo {
    return this.info;
  }

  addTrigger(note: string, sample: Sample): void {
    this.triggers.push({note: note, sample: sample});
  }

  getNotes(): Array<string> {
    return this.triggers.map(t => t.note);
  }


  destroy(): void {
    this.samples.forEach(sample=>sample.destroy());
  }

  feed(event: NoteTrigger, offset: number): any {
    let trigger = this.triggers.find(trigger => trigger.note === event.note);
    if (!trigger) console.warn("no trigger found for " + event.note);
    else trigger.sample.trigger(offset);
  }


  load(): Promise<WstPlugin> {
    return new Promise((resolve, reject) => {

      this.fileService.getFile(this.config.getAssetsUrl("config/drums/drumkit1.json"))
        .then((config: InstrumentMapping) => {
          let promises = [];
          let urls = config.mappings.map(map => this.config.getAssetsUrl("sounds/drums/drumkit1/" + map.url));
          let promise = this.samplesV2Service.getSamples(urls);
          promises.push(promise);
          promise.then((samples: Array<Sample>) => {
            this.samples=samples;
            samples.forEach((sample, i) => {
              let spec = config.mappings[i];
              this.addTrigger(spec.note, sample);
            })

          }).catch(error => reject(error));

          Promise.all(promises).then(() => resolve(this)).catch(error => reject(error));
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
    this.inputNode=node;
  }

  setOutputNode(node: VirtualAudioNode<AudioNode>): void {
    this.outputNode=node;
    this.samples.forEach(sample=>sample.setDestination(node.node));
  }

}
