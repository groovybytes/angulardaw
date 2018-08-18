import {Sample} from "../Sample";
import {NoteTrigger} from "../../mip/NoteTrigger";
import {WstPlugin} from "../WstPlugin";
import {PluginId} from "./PluginId";
import {TransportPosition} from "../TransportPosition";
import {InstrumentMapping} from "../../mip/instruments/drums/spec/InstrumentMapping";
import {AppConfiguration} from "../../../app.configuration";
import {NoteTriggerViewModel} from "../../viewmodel/NoteTriggerViewModel";
import {FilesApi} from "../../../shared/api/files.api";
import {SamplesApi} from "../../../shared/api/samples.api";


export class Drums implements WstPlugin {

  constructor(
    private fileService: FilesApi,
    private config: AppConfiguration,
    private samplesV2Service: SamplesApi
  ) {

  }

  private triggers: Array<{ note: string, sample: Sample }> = [];

  addTrigger(note: string, sample: Sample): void {
    this.triggers.push({note: note, sample: sample});
  }

  getNotes(): Array<string> {
    return this.triggers.map(t => t.note);
  }

  getId(): PluginId {
    return PluginId.DRUMKIT1;
  }

  destroy(): void {
  }

  feed(event: NoteTriggerViewModel, offset: number): any {
    let trigger = this.triggers.find(trigger => trigger.note === event.note);
    trigger.sample.trigger(offset);
  }


  load(): Promise<Drums> {
    return new Promise((resolve, reject) => {

      this.fileService.getFile(this.config.getAssetsUrl("config/drums/drumkit1.json"))
        .then((config: InstrumentMapping) => {
          let promises = [];
          let urls = config.mappings.map(map => this.config.getAssetsUrl("sounds/drums/drumkit1/" + map.url));
          let promise = this.samplesV2Service.getSamples(urls);
          promises.push(promise);
          promise.then((samples: Array<Sample>) => {
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

  /*private chooseSample(note: NoteInfo): Sample {
    let closestSampleByNote = this.closest(this.triggers.map(trigger => trigger.note.index), note.index);
    return this.triggers.filter(trigger => trigger.note.index === closestSampleByNote)[0].sample;
  }

  private closest(array: Array<number>, num) {
    var i = 0;
    var minDiff = 1000;
    var ans;
    array.forEach(() => {
      var m = Math.abs(num - array[i]);
      if (m < minDiff) {
        minDiff = m;
        ans = array[i];
      }
      i++;
    })
    return ans;
  }*/


}
