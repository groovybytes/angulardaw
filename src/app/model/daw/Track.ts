import {TransportEvents} from "./events/TransportEvents";
import {TransportInfo} from "./TransportInfo";
import {PerformanceStreamer} from "./events/PerformanceStreamer";
import {PerformanceEvent} from "./events/PerformanceEvent";
import {WstPlugin} from "./WstPlugin";
import {Subscription} from "rxjs";
import {TransportPosition} from "./TransportPosition";
import {TrackDto} from "../../shared/api/TrackDto";
import * as _ from "lodash";

export class Track {
  model:TrackDto;
  private streamer: PerformanceStreamer;
  private subscriptions: Array<Subscription> = [];
  plugin:WstPlugin;

  constructor(model:TrackDto,protected transportEvents: TransportEvents, protected transportInfo: TransportInfo) {
    this.model=model;
    this.streamer = new PerformanceStreamer(model.events,transportEvents, this.transportInfo);
    this.subscriptions.push(this.streamer.trigger.subscribe(event => this.onNextEvent(event.position,event.event)));
  }

  private onNextEvent(position:TransportPosition,event: PerformanceEvent<any>): void {
    this.plugin.feed(event,position);
  }


  addEvent(event: PerformanceEvent<any>): void {
    let insertIndex = _.sortedIndexBy(this.model.events, {'time': event.time}, event => event.time);
    this.model.events.splice(insertIndex, 0, event);
  }

  removeEvent(event: PerformanceEvent<any>): void {
    throw "not implemented";
  }

  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
