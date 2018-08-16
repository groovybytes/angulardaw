import {AbstractInstrumentSampler} from "./AbstractInstrumentSampler";
import {PluginId} from "./PluginId";
import {AppConfiguration} from "../../../app.configuration";
import {SamplesApi} from "../../../shared/api/samples.api";
import {FilesApi} from "../../../shared/api/files.api";
import {TheoryService} from "../../../shared/services/theory.service";
import {Sample} from "../Sample";

export class Bass extends AbstractInstrumentSampler {

  constructor(protected theoryService: TheoryService,
              private fileService: FilesApi,
              private config: AppConfiguration,
              private samplesV2Service: SamplesApi) {
    super(theoryService);
  }

  getId(): PluginId {
    return PluginId.BASS1;
  }

  destroy(): void {
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
