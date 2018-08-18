import {TransportEvents} from "./events/TransportEvents";
import {TransportInfo} from "./TransportInfo";
import {PerformanceStreamer} from "./events/PerformanceStreamer";
import {WstPlugin} from "./WstPlugin";
import {Subscription} from "rxjs";
import {TransportPosition} from "./TransportPosition";
import {TrackViewModel} from "../viewmodel/TrackViewModel";
import * as _ from "lodash";
import {NoteTriggerViewModel} from "../viewmodel/NoteTriggerViewModel";

export class Track {
  id:string;
  model:TrackViewModel;
  private streamer: PerformanceStreamer;
  private subscriptions: Array<Subscription> = [];
  plugin:WstPlugin;

  constructor(model:TrackViewModel, protected transportEvents: TransportEvents, protected transportInfo: TransportInfo) {
    this.model=model;
    this.streamer = new PerformanceStreamer(model.events,transportEvents, this.transportInfo);
    this.subscriptions.push(this.streamer.trigger.subscribe(event => this.onNextEvent(event.offset,event.event)));
  }

  private onNextEvent(offset:number,event: NoteTriggerViewModel): void {
    this.plugin.feed(event,offset);
  }


  resetEvents(events:Array<NoteTriggerViewModel>):void{
    this.model.events=events;
    this.streamer.updateEventQueue(events);
  }
  addEvent(event: NoteTriggerViewModel): void {
    let insertIndex = _.sortedIndexBy(this.model.events, {'time': event.time}, event => event.time);
    this.model.events.splice(insertIndex, 0, event);
  }

  removeEvent(id:string): void {
    let index = this.model.events.findIndex(ev=>ev.id===id);
    this.model.events.splice(index, 1);

  }

  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
