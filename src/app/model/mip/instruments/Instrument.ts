export interface Instrument {

  getName(): string;

  play(note: string, time: number, length: number, loudness: number, articulation?: number): void;
}
