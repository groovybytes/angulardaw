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
      let provedSamples: Array<Sample> = [];
      this.samplesV2Service.getSamplesForInstrument("Acoustic Bass")
        .then(results => {
          results.forEach(result => {
            try {

              let parts = result.id.split("/");
              let sampleName = parts[parts.length - 1].split(".")[0].toLowerCase();
              sampleName = sampleName.replace("l-ra", "");
              sampleName = sampleName.replace("l-r", "");
              sampleName = sampleName.toUpperCase();
              parts = sampleName.split(" ");
              let noteName = parts[parts.length - 1].replace("#", "i");
              if (provedSamples.findIndex(sample => sample.baseNote.id === noteName) === -1) {
                result.baseNote = this.theoryService.getNote(noteName);
                if (result.baseNote === undefined) throw new Error("couldnt find a basenote from sample name " + sampleName);
                provedSamples.push(result);
              }
            } catch (e) {
              console.log(e);
            }
          });

          this.samples=provedSamples;
          this.baseSampleNotes=this.samples.map(sample => sample.baseNote.index);
          resolve(this);
        })
        .catch(error => reject(error));
    })
  }

  getNotes(): Array<string> {
    return this.theoryService.getNoteRange("E1","Di5");
  }


}
