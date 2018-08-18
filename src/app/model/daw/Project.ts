import {Track} from './Track';
import {ProjectViewModel} from "../viewmodel/ProjectViewModel";
import {Metronome} from "./components/Metronome";
import {WstPlugin} from "./WstPlugin";

export class Project {
  model:ProjectViewModel;
  metronome:WstPlugin;
  readonly tracks: Array<Track> = [];

  constructor(model:ProjectViewModel) {
    this.model=model;
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }


}


