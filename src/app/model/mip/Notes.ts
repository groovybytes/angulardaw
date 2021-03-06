import * as _ from "lodash";
import {NoteInfo} from "../utils/NoteInfo";
import {ScaleId} from "./scales/ScaleId";
import {Scales} from "./scales/Scales";
import {Scale} from "./scales/Scale";

export class Notes {
  //private readonly notes: any;
  readonly notes: Array<NoteInfo>;
  private readonly notesByMidi: any;
  //private notesArray: Array<NoteInfo> = [];
  private scale: Scale;
  private frequencies;

  constructor(private scaleId: ScaleId) {

    let i = 0;
    //this.notes = {};
    this.notes = [];
    this.notesByMidi = {};

    let scale = this.scale = Scales.get(scaleId);
    if (scaleId !== ScaleId.CHROMATIC) {
      this.frequencies = this.getFrequenciesByFormula(scale.formula);
    } else this.frequencies = this.allFrequencies;

    Object.keys(this.frequencies).forEach(freq => {
      let note = new NoteInfo();
      note.frequency = this.frequencies[freq];
      note.id = freq.replace("#", "i");
      note.index = i;
      note.midi = i + 21;
      this.notes.push(note);
      this.notesByMidi["midi_" + note.midi] = note;
      i++;
    })
  }

  public getAllIds(): Array<string> {
    return this.notes.map(note=>note.id);
  }

  public getSortedByIndex(): Array<string> {
    return null;
  }

  public move(note: NoteInfo, semitones: number): NoteInfo {
    return this.notes.find(_note=>_note.index===note.index + semitones)
  }

  public getNote(id: string): NoteInfo {
    return this.notes.find(note=>note.id===id);
  }

  public getNoteByIndex(index: number): NoteInfo {
    return this.notes.find(note => note.index === index);
  }

  public getNoteRange(from: string, to: string): Array<string> {
    let startNote = this.getNote(from);
    let endNote = this.getNote(to);

    return this.notes.filter(note => note.index >= startNote.index && note.index <= endNote.index).map(note => note.id);
  }

  public getInterval(note1: NoteInfo, note2: NoteInfo): number {
    return note2.index - note1.index;
  }

  public getNoteByDegree(baseNote: string, degree: number): string {

    let base = this.getNote(baseNote);
    let index = base.index + degree;
    return this.getNoteByIndex(index).id;
  }

  public getFrequenciesByFormula(formula: Array<number>): any {

    let result = {};

    _.keys(this.allFrequencies).forEach((key, i) => {
      let interval = (i % 12) + 1;
      if (formula.indexOf(interval) >= 0) result[key] = this.allFrequencies[key];
    });

    return result;
  }


  private allFrequencies = {
    "C0": 16.351597831287414,
    "C#0": 17.323914436054505,
    "D0": 18.354047994837977,
    "D#0": 19.445436482630058,
    "E0": 20.601722307054366,
    "F0": 21.826764464562746,
    "F#0": 23.12465141947715,
    "G0": 24.499714748859326,
    "G#0": 25.956543598746574,
    "A0": 27.5,
    "A#0": 29.13523509488062,
    "B0": 30.86770632850775,
    "C1": 32.70319566257483,
    "C#1": 34.64782887210901,
    "D1": 36.70809598967594,
    "D#1": 38.890872965260115,
    "E1": 41.20344461410875,
    "F1": 43.653528929125486,
    "F#1": 46.2493028389543,
    "G1": 48.999429497718666,
    "G#1": 51.91308719749314,
    "A1": 55,
    "A#1": 58.27047018976124,
    "B1": 61.7354126570155,
    "C2": 65.40639132514966,
    "C#2": 69.29565774421802,
    "D2": 73.41619197935188,
    "D#2": 77.78174593052023,
    "E2": 82.4068892282175,
    "F2": 87.30705785825097,
    "F#2": 92.4986056779086,
    "G2": 97.99885899543733,
    "G#2": 103.82617439498628,
    "A2": 110,
    "A#2": 116.54094037952248,
    "B2": 123.47082531403103,
    "C3": 130.8127826502993,
    "C#3": 138.59131548843604,
    "D3": 146.8323839587038,
    "D#3": 155.56349186104046,
    "E3": 164.81377845643496,
    "F3": 174.61411571650194,
    "F#3": 184.9972113558172,
    "G3": 195.99771799087463,
    "G#3": 207.65234878997256,
    "A3": 220,
    "A#3": 233.08188075904496,
    "B3": 246.94165062806206,
    "C4": 261.6255653005986,
    "C#4": 277.1826309768721,
    "D4": 293.6647679174076,
    "D#4": 311.1269837220809,
    "E4": 329.6275569128699,
    "F4": 349.2282314330039,
    "F#4": 369.9944227116344,
    "G4": 391.99543598174927,
    "G#4": 415.3046975799451,
    "A4": 440,
    "A#4": 466.1637615180899,
    "B4": 493.8833012561241,
    "C5": 523.2511306011972,
    "C#5": 554.3652619537442,
    "D5": 587.3295358348151,
    "D#5": 622.2539674441618,
    "E5": 659.2551138257398,
    "F5": 698.4564628660078,
    "F#5": 739.9888454232688,
    "G5": 783.9908719634985,
    "G#5": 830.6093951598903,
    "A5": 880,
    "A#5": 932.3275230361799,
    "B5": 987.7666025122483,
    "C6": 1046.5022612023945,
    "C#6": 1108.7305239074883,
    "D6": 1174.6590716696303,
    "D#6": 1244.5079348883237,
    "E6": 1318.5102276514797,
    "F6": 1396.9129257320155,
    "F#6": 1479.9776908465376,
    "G6": 1567.981743926997,
    "G#6": 1661.2187903197805,
    "A6": 1760,
    "A#6": 1864.6550460723597,
    "B6": 1975.533205024496,
    "C7": 2093.004522404789,
    "C#7": 2217.4610478149766,
    "D7": 2349.31814333926,
    "D#7": 2489.0158697766474,
    "E7": 2637.02045530296,
    "F7": 2793.825851464031,
    "F#7": 2959.955381693075,
    "G7": 3135.9634878539946,
    "G#7": 3322.437580639561,
    "A7": 3520,
    "A#7": 3729.3100921447194,
    "B7": 3951.066410048992,
    "C8": 4186.009044809578,
    "C#8": 4434.922095629953,
    "D8": 4698.63628667852,
    "D#8": 4978.031739553295,
    "E8": 5274.04091060592,
    "F8": 5587.651702928062,
    "F#8": 5919.91076338615,
    "G8": 6271.926975707989,
    "G#8": 6644.875161279122,
    "A8": 7040,
    "A#8": 7458.620184289437,
    "B8": 7902.132820097988,
    "C9": 8372.018089619156,
    "C#9": 8869.844191259906,
    "D9": 9397.272573357044,
    "D#9": 9956.06347910659,
    "E9": 10548.081821211836,
    "F9": 11175.303405856126,
    "F#9": 11839.8215267723,
    "G9": 12543.853951415975,
    "G#9": 13289.750322558246,
    "A9": 14080,
    "A#9": 14917.240368578874,
    "B9": 15804.265640195976,
    "C10": 16744.036179238312,
    "C#10": 17739.688382519813,
    "D10": 18794.54514671409,
    "D#10": 19912.12695821318,
    "E10": 21096.16364242367,
    "F10": 22350.606811712252,
    "F#10": 23679.6430535446,
    "G10": 25087.70790283195,
    "G#10": 26579.50064511649,
    "A10": 28160,
    "A#10": 29834.480737157748,
    "B10": 31608.53128039195
  }


}
