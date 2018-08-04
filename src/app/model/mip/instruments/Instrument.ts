import {Instruments} from "../../daw/instruments/Instruments";

export interface Instrument {

  getId(): Instruments;

  play(note: string, time?: number, length?: number, loudness?: number, articulation?: number): void;
}
