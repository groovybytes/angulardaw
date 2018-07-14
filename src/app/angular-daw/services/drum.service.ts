import {Injectable} from "@angular/core";
import {SimpleDrum} from "../model/drums/SimpleDrum";
import {System} from "../../system/System";
import {AppConfiguration} from "../../app.configuration";
import {SamplesV2Service} from "./samplesV2.service";
import {Sample} from "../model/Sample";
import {ADSREnvelope} from "../model/mip/ADSREnvelope";
import {Instrument} from "../model/Instrument";
import {DrumKitSpec} from "../model/mip/drums/specs/DrumKitSpec";

@Injectable()
export class DrumService {
  drums: SimpleDrum;
  private reverb: Sample;

  constructor(
    private samplesV2Service: SamplesV2Service,
    private system: System,
    private config: AppConfiguration) {

  }

  load(): void {
    let samples = [
      this.config.getAssetsUrl("sounds/drums/drumkit1/kick.wav"),
      this.config.getAssetsUrl("sounds/drums/drumkit1/snare.wav"),
      this.config.getAssetsUrl("sounds/drums/drumkit1/hihat.wav")
    ]

    this.samplesV2Service.getSamples(samples).then(result => {
      let drum = this.drums = new SimpleDrum();
      drum.kick = result[0];
      drum.snare = result[1];
      drum.hihat = result[2];

    }, error => this.system.error(error));

    this.samplesV2Service.getSamples([this.config.getAssetsUrl("sounds/impulses/PlateMedium.wav")]).then(result => {
      this.reverb = result[0];

    }, error => this.system.error(error));

  }

  fromDrumKitSpec(spec:DrumKitSpec):Promise<Instrument>{

    return null;

  }

  playKick(): void {
    this.drums.kick.triggerWith(ADSREnvelope.default(), this.reverb);
  }

  playSnare(): void {
    this.drums.snare.triggerWith(ADSREnvelope.default(), this.reverb);
  }

  playHihat(): void {
    this.drums.hihat.triggerWith(ADSREnvelope.default(), this.reverb);
  }
}
