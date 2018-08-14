import {Track} from './Track';
import {ProjectDto} from "../../shared/api/ProjectDto";

export class Project {
  id:string;
  model:ProjectDto;
  readonly tracks: Array<Track> = [];

  constructor(model:ProjectDto) {
    this.model=model;
    model.tracks.forEach(trackDto=>{
      this.tracks.push(new Track(trackDto,null,null));

    })
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }


}


