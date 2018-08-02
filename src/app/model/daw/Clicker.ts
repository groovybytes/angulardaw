import {Sample} from "./Sample";
import {Instrument} from "../mip/instruments/Instrument";

export class Clicker implements Instrument{

  constructor(private accentSample:Sample,private otherSample:Sample) {
  }
/*
  bootstrap(): void {
    this.sampleService.getSamples([
      this.config.getAssetsUrl("sounds/metronome/click1.wav"),
      this.config.getAssetsUrl("sounds/metronome/click2.wav")]).then(result => {
      this.click1 = result[0];
      this.click2 = result[1];
    });
  }*/

  /*click(accent:boolean): void {
    if (accent) this.accentSample.trigger();
    else this.otherSample.trigger();
  }*/

  getName(): string {
    return "clicker";
  }

  play(note: string, time: number, length: number, loudness: number, articulation?: number): void {
    if (note === "A1") this.accentSample.trigger();
    else this.otherSample.trigger();
  }


}
