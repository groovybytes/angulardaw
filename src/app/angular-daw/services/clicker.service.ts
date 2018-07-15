import {Injectable} from "@angular/core";
import {SamplesV2Service} from "./samplesV2.service";
import {AppConfiguration} from "../../app.configuration";
import {Sample} from "../model/Sample";

@Injectable()
export class ClickerService {

  private click1: Sample;
  private click2: Sample;

  constructor(
    private sampleService: SamplesV2Service,
    private config: AppConfiguration) {
  }

  bootstrap(): void {
    this.sampleService.getSamples([
      this.config.getAssetsUrl("sounds/metronome/click1.wav"),
      this.config.getAssetsUrl("sounds/metronome/click2.wav")]).then(result => {
      this.click1 = result[0];
      this.click2 = result[1];
    });
  }

  click(accent:boolean): void {
    if (accent) this.click2.trigger();
    else this.click1.trigger();
  }


}
