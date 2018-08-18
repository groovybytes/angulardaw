import {Sample} from "../Sample";
import {TransportPosition} from "../TransportPosition";
import {AppConfiguration} from "../../../app.configuration";
import {FilesApi} from "../../../shared/api/files.api";
import {SamplesApi} from "../../../shared/api/samples.api";
import {TransportService} from "../../../shared/services/transport.service";
import {Subscription} from "rxjs/internal/Subscription";


export class Metronome {

  private lastBeat: number = -1;
  private accentSample: Sample;
  private otherSample: Sample;
  private transportSubscription: Subscription;

  enabled: boolean = true;

  constructor(private fileService: FilesApi,
              private config: AppConfiguration,
              private transportService: TransportService,
              private samplesV2Service: SamplesApi) {

    this.transportSubscription = transportService.tickTock.subscribe(tick => {
     // this.feed(this.transportService.getPositionInfo())
    });
  }


  destroy(): void {
    this.transportSubscription.unsubscribe();
  }

  feed(position: TransportPosition): void {
    /*if (position.beat !== this.lastBeat) {
      if (position.beat === 0) this.accentSample.trigger(0);
      else this.otherSample.trigger(0);
    }*/

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
