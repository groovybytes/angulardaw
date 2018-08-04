import {Instrument} from "../mip/instruments/Instrument";
import {TransportObservable} from "./TransportObservable";
import {TrackCategory} from "./TrackCategory";

export abstract class Track {
  id: any;
  index: number;
  name: string;
  instrument: Instrument;
  category:TrackCategory=TrackCategory.MIDI;
  protected transport: TransportObservable;

  constructor() {

  }

  setTransport(transport: TransportObservable): void {
    this.transport = transport;
    this.onTransportInit();
  }

  protected abstract onTransportInit():void;
  abstract destroy():void;


}
