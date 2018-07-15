import {Sample} from "../../../Sample";
import {Articulation} from "./Articulation";

export class DrumSample {
  piece:string;
  articulation:Articulation;
  sample:Sample;

  constructor(piece: string, articulation: Articulation, sample: Sample) {
    this.piece = piece;
    this.articulation = articulation;
    this.sample = sample;
  }
}
