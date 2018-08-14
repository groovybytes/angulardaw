import {Track} from './Track';
import {ProjectViewModel} from "../viewmodel/ProjectViewModel";

export class Project {
  model:ProjectViewModel;
  readonly tracks: Array<Track> = [];

  constructor(model:ProjectViewModel) {
    this.model=model;
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }


}


