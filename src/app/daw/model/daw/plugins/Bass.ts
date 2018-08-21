import {AbstractInstrumentSampler} from "./AbstractInstrumentSampler";
import {PluginId} from "./PluginId";
import {SamplesApi} from "../../../shared/api/samples.api";
import {FilesApi} from "../../../shared/api/files.api";
import {TheoryService} from "../../../shared/services/theory.service";
import {Sample} from "../Sample";
import {PluginInfo} from "./PluginInfo";

export class Bass extends AbstractInstrumentSampler {

  constructor(protected theoryService: TheoryService,
              private fileService: FilesApi,
              private samplesV2Service: SamplesApi) {
    super(theoryService);
  }

  getId(): PluginId {
    return PluginId.BASS1;
  }

  destroy(): void {
  }

  static getInfo(): PluginInfo {
    let info = new PluginInfo();
    info.id=PluginId.BASS1;
    info.name="bass";
    return info;
  }

  load(): Promise<AbstractInstrumentSampler> {
    return new Promise<AbstractInstrumentSampler>((resolve, reject) => {
      this.samplesV2Service.loadAllInstrumentSamples("Acoustic Bass")
        .then(result => {
          this.samples = result.samples;
          this.baseSampleNotes = result.baseNotes;
          resolve(this);
        })
        .catch(error => reject(error));
    })
  }

  getNotes(): Array<string> {
    return this.theoryService.getNoteRange("E1", "Di5");
  }


}
