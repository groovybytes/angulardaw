import {AbstractInstrumentSampler} from "./AbstractInstrumentSampler";
import {SamplesApi} from "../../../shared/api/samples.api";
import {FilesApi} from "../../../shared/api/files.api";
import {TheoryService} from "../../../shared/services/theory.service";
import {AppConfiguration} from "../../../../app.configuration";
import {PluginInfo} from "./PluginInfo";

export class GenericInstrumentSampler extends AbstractInstrumentSampler {

  constructor(
    protected id:string,private pluginInfo:PluginInfo,
              protected theoryService: TheoryService,
              private fileService: FilesApi,
              private config: AppConfiguration,
              private samplesV2Service: SamplesApi) {
    super(id,theoryService,pluginInfo);
  }

  getId(): string {
    return this.id;
  }

  destroy(): void {
    this.samples.forEach(sample=>sample.destroy());
  }

  load(): Promise<AbstractInstrumentSampler> {
    return new Promise<AbstractInstrumentSampler>((resolve, reject) => {
      this.samplesV2Service.loadAllInstrumentSamples(this.pluginInfo.folder)
        .then(result => {
          this.samples = result.samples;
          this.baseSampleNotes = result.baseNotes;
          resolve(this);
        })
        .catch(error => reject(error));
    })
  }

  getNotes(): Array<string> {
    if (this.pluginInfo.noteRange) return this.theoryService.getNoteRange(this.pluginInfo.noteRange.start,this.pluginInfo.noteRange.end);
    else this.theoryService.getNoteRange("C0", "B10");
  }

 /* static getInfo(): PluginInfo {
    let info = new PluginInfo();
    info.id=PluginId.PIANO1;
    info.name=this.nam;
    return info;
  }*/


}
