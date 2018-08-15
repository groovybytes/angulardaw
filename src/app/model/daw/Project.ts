import {Track} from './Track';
import {ProjectViewModel} from "../viewmodel/ProjectViewModel";
import {Metronome} from "./components/Metronome";

export class Project {
  model:ProjectViewModel;
  metronome:Metronome;
  readonly tracks: Array<Track> = [];

  constructor(model:ProjectViewModel) {
    this.model=model;
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }


}


