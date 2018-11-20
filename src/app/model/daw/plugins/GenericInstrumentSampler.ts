import {AbstractInstrumentSampler} from "./AbstractInstrumentSampler";
import {PluginInfo} from "./PluginInfo";
import {Sample} from "../Sample";
import {Notes} from "../Notes";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";

export class GenericInstrumentSampler extends AbstractInstrumentSampler {

  constructor(
    protected id: string,
    private pluginInfo: PluginInfo,
    private sampleGetter: (instrumentName: string) => Promise<{ samples: Array<Sample>, baseNotes: Array<number> }>,
    protected notes: Notes,
  ) {
    super(id,notes,pluginInfo);
  }

  getId(): string {
    return this.id;
  }

  destroy(): void {
    this.samples.forEach(sample => sample.destroy());
  }

  load(): Promise<AbstractInstrumentSampler> {
    return new Promise<AbstractInstrumentSampler>((resolve, reject) => {
      this.sampleGetter(this.pluginInfo.folder)
        .then(result => {
          this.samples = result.samples;
          this.baseSampleNotes = result.baseNotes;
          resolve(this);
        })
        .catch(error => reject(error));
    })
  }

  getNotes(): Array<string> {
    if (this.pluginInfo.noteRange) return this.notes.getNoteRange(this.pluginInfo.noteRange.start, this.pluginInfo.noteRange.end);
    else this.notes.getNoteRange("C0", "B10");
  }

  getInstrumentCategory(): InstrumentCategory {
    return InstrumentCategory.KEYS;
  }

  /* static getInfo(): PluginInfo {
     let info = new PluginInfo();
     info.id=PluginId.PIANO1;
     info.name=this.nam;
     return info;
   }*/


}
