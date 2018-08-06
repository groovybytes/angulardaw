import {TrackCategory} from "./TrackCategory";
import {TransportEvents} from "./events/TransportEvents";
import {TransportInfo} from "./TransportInfo";
import {PerformanceStreamer} from "./events/PerformanceStreamer";
import {PerformanceEvent} from "./events/PerformanceEvent";
import {WstPlugin} from "./WstPlugin";
import {Subscription} from "rxjs";
import {any} from "codelyzer/util/function";
import {TransportPosition} from "./TransportPosition";

export class Track {
  projectId: string;
  id: any;
  index: number;
  name: string;
  plugins: Array<WstPlugin> = [];
  effects: any;
  category: TrackCategory = TrackCategory.MIDI;
  private streamer: PerformanceStreamer;
  private subscriptions: Array<Subscription> = [];

  constructor(projectId: any, protected transportEvents: TransportEvents, protected transportInfo: TransportInfo) {
    this.projectId = projectId;
    this.streamer = new PerformanceStreamer(transportEvents, this.transportInfo);
    this.subscriptions.push(this.streamer.trigger.subscribe(event => this.onNextEvent(event.position,event.event)));
  }

  private onNextEvent(position:TransportPosition,event: PerformanceEvent<any>): void {
    this.plugins.forEach(plugin => plugin.feed(event,position));
  }

  addEvent(event: PerformanceEvent<any>): void {
    this.streamer.addEvent(event);
  }

  removeEvent(event: PerformanceEvent<any>): void {
    throw "not implemented";
  }

  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
