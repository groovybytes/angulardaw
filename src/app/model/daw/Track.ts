import {Instrument} from "../mip/instruments/Instrument";
import {TrackCategory} from "./TrackCategory";
import {TransportEvents} from "./TransportEvents";
import {TransportInfo} from "./TransportInfo";

export abstract class Track {
  id: any;
  index: number;
  name: string;
  instrument: Instrument;
  effects:any;
  category:TrackCategory=TrackCategory.MIDI;

  constructor(protected transportEvents:TransportEvents,protected transportInfo:TransportInfo) {

  }

 /* setTransport(transport: TransportObservable): void {
    this.transport = transport;
    this.onTransportInit();
  }*/

  abstract destroy():void;


}
