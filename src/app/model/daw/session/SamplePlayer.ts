import {AudioPlugin} from "../plugins/AudioPlugin";
import {PlayerSession} from "./PlayerSession";

export interface SamplePlayer{
  play(plugin: AudioPlugin, note: string, time: number, length: number, session: PlayerSession): void;
}
