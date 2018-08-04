import {Track} from './Track';
import {TransportParams} from "./TransportParams";
import {Transport} from "./Transport";
import {TrackCategory} from "./TrackCategory";
import {MidiTrack} from "./MidiTrack";
import {ClickTrack} from "./ClickTrack";

export class Project {
  transportParams: TransportParams = new TransportParams();
  id: any;
  userId: any;
  name: string;
  readonly tracks: Array<Track> = [];
  transport: Transport;

  constructor() {

  }

  newTrack(category: TrackCategory): Track {
    let track: Track;
    if (category === TrackCategory.MIDI) track = new MidiTrack();
    else if (category === TrackCategory.CLICK) track = new ClickTrack();
    else throw "category not found";
    if (this.transport) track.setTransport(this.transport);
    this.tracks.push(track);

    return track;
  }

  registerTrack(track: Track): void {
    track.setTransport(this.transport);
    this.tracks.push(track);
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }



}


