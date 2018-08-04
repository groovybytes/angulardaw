import {Injectable} from "@angular/core";
import {SamplesApi} from "./samples.api";
import {Sample} from "../model/daw/Sample";
import {FilesApi} from "./files.api";
import {System} from "../system/System";
import {AppConfiguration} from "../app.configuration";
import {Drums} from "../model/daw/instruments/Drums";
import {InstrumentMapping} from "../model/mip/instruments/drums/spec/InstrumentMapping";

@Injectable()
export class DrumApi {

  constructor(
    private samplesV2Service: SamplesApi,
    private system: System,
    private fileService: FilesApi,
    private config: AppConfiguration) {

  }

  getDrums(id: string): Promise<Drums> {
    return new Promise((resolve, reject) => {
      let drums = new Drums();
      this.fileService.getFile(this.config.getAssetsUrl("config/drums/" + id + ".json"))
        .then((config: InstrumentMapping) => {
          let promises = [];
          let urls = config.mappings.map(map => this.config.getAssetsUrl("sounds/drums/"+id+"/"+map.url));
          let promise = this.samplesV2Service.getSamples(urls);
          promises.push(promise);
          promise.then((samples: Array<Sample>) => {
            samples.forEach((sample, i) => {
              let spec = config.mappings[i];
              drums.addTrigger(spec.note,sample);
            })

          }).catch(error => reject(error));

          Promise.all(promises).then(() => resolve(drums)).catch(error => reject(error));
        })
        .catch(error => reject(error));
    })


  }

}
