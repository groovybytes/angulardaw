import {ADSREnvelope} from "./ADSREnvelope";
import {Frequencies} from "./Frequencies";

export class Note {
  constructor(name: string, time: number, envelope: ADSREnvelope, frequency: number) {
    this.name = name;
    this.time = time;
    this.envelope = envelope;
    this.frequency = frequency;
  }

  static create(name:string):Note{
    return new Note(name,0,ADSREnvelope.default(),0);
  }
  name: string;
  time: number;
  envelope:ADSREnvelope;
  frequency:number;
}
