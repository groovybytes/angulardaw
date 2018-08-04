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

  /*newTrack(category: TrackCategory): Track {
    let track: Track;
    if (category === TrackCategory.MIDI) track = new MidiTrack();
    else if (category === TrackCategory.CLICK) track = new ClickTrack();
    else throw "category not found";
    this.tracks.push(track);

    return track;
  }

  registerTrack(track: Track): void {
    this.tracks.push(track);
  }*/

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }



}


