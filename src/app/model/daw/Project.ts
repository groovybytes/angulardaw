import {Track} from './Track';
import {TransportParams} from "./TransportParams";

export class Project {
  transportParams: TransportParams = new TransportParams();
  id: any;
  userId: any;
  name: string;
  readonly tracks: Array<Track> = [];


  constructor() {

  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }



}


