import {WstPlugin} from "../WstPlugin";
import {PluginId} from "./PluginId";
import {PerformanceEvent} from "../events/PerformanceEvent";
import {Sample} from "../Sample";
import {TransportPosition} from "../TransportPosition";
import {FilesApi} from "../../../api/files.api";
import {SamplesApi} from "../../../api/samples.api";
import {AppConfiguration} from "../../../app.configuration";


export class Metronome implements WstPlugin {

  private lastBeat: number = -1;
  private accentSample: Sample;
  private otherSample: Sample;

  constructor(private fileService: FilesApi,
              private config: AppConfiguration,
              private samplesV2Service: SamplesApi) {
  }


  getId(): PluginId {
    return PluginId.METRONOME;
  }

  destroy(): void {
  }

  feed(event: PerformanceEvent<void>, position: TransportPosition): any {
    if (position.beat !== this.lastBeat) {
      if (position.beat === 0) this.accentSample.trigger();
      else this.otherSample.trigger();
    }

  }

  load(): Promise<Metronome> {
    return new Promise((resolve, reject) => {
      this.samplesV2Service.getClickSamples().then(result => {
        this.accentSample = result.accentSample;
        this.otherSample = result.defaultSample;
        resolve(this);
      })
        .catch(error => reject(error));
    })
  }


}
