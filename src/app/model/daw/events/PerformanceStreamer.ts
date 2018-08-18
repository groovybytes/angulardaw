import * as _ from "lodash";
import {Subscription} from "rxjs/internal/Subscription";
import {TransportEvents} from "./TransportEvents";
import {TransportInfo} from "../TransportInfo";
import {Observable, Subject} from "rxjs";
import {TransportPosition} from "../TransportPosition";
import {NoteTriggerViewModel} from "../../viewmodel/NoteTriggerViewModel";

export class PerformanceStreamer {
  private queue: Array<NoteTriggerViewModel> = [];
  private queueIndex: number = 0;
  private lookAhead: number = 2;//seconds
  private subscriptions: Array<Subscription> = [];
  trigger: Observable<{ event: NoteTriggerViewModel, offset: number }>;
  private triggerSubject: Subject<{ event: NoteTriggerViewModel, offset: number }> = new Subject();
  private timeStamp:number;
  private eventPool: Array<NoteTriggerViewModel> = [];

  constructor(events: Array<NoteTriggerViewModel>, protected transportEvents: TransportEvents, protected transportInfo: TransportInfo) {
    this.queue = events;
    this.trigger = this.triggerSubject.asObservable();
    this.subscriptions.push(this.transportEvents.time.subscribe(time => this.onTransportTime(time)));
    /* this.subscriptions.push(this.transportEvents.timeReset.subscribe(() => this.initLoopQueue()));*/
    this.subscriptions.push(this.transportEvents.beforeStart.subscribe(() => this.initLoopQueue()));
  }

  private onTransportTime(transportTime: number): void {

    if (this.timeStamp && this.timeStamp>transportTime){
      this.initLoopQueue();
    }
    this.timeStamp=transportTime;
    if (this.eventPool.length > 0 && this.eventPool[0].time / 1000 <= transportTime) {
      let nextEvents = _.remove(this.eventPool, ev => {
        return ev.time / 1000 <= (transportTime + this.lookAhead)
      });
      nextEvents.forEach(event => {
        this.triggerSubject.next({event: event, offset: event.time / 1000 - transportTime});
      });
    }
  }

  private initLoopQueue(): void {
    let startTime = this.transportInfo.getStartTime();
    let endTime = this.transportInfo.getEndTime();

    this.eventPool = _.clone(this.queue.filter(ev => ev.time >= startTime && ev.time <= endTime));

  }

  updateEventQueue(events: Array<NoteTriggerViewModel>): void {
    this.queue = events;
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


}
