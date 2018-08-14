import * as _ from "lodash";
import {Subscription} from "rxjs/internal/Subscription";
import {TransportEvents} from "./TransportEvents";
import {TransportInfo} from "../TransportInfo";
import {PerformanceEvent} from "./PerformanceEvent";
import {Observable, Subject} from "rxjs";
import {TransportPosition} from "../TransportPosition";

export class PerformanceStreamer {
  queue: Array<PerformanceEvent<any>> = [];
  private loopQueue: Array<PerformanceEvent<any>> = [];
  private queueIndex: number = 0;
  private accuracy = 0.03;
  private subscriptions: Array<Subscription> = [];
  trigger: Observable<{ event: PerformanceEvent<any>, position: TransportPosition }>;
  private triggerSubject: Subject<{ event: PerformanceEvent<any>, position: TransportPosition }> = new Subject();

  constructor(events: Array<PerformanceEvent<any>>, protected transportEvents: TransportEvents, protected transportInfo: TransportInfo) {
    this.queue = events;
    this.trigger = this.triggerSubject.asObservable();
    this.subscriptions.push(this.transportEvents.time.subscribe(time => this.onTransportTime(time)));
    this.subscriptions.push(this.transportEvents.timeReset.subscribe(() => {
      let startTime = this.transportInfo.getStartTime();
      let endTime = this.transportInfo.getEndTime();
      this.queueIndex = 0;
      this.loopQueue = this.queue.filter(d => d.time >= startTime && d.time <= endTime);
    }));
  }

  private onTransportTime(transportTime: number): void {
    console.log(transportTime);
    if (this.loopQueue.length > 0 && this.queueIndex < this.loopQueue.length) {
      let matches = 0;
      for (let i = this.queueIndex; i < this.queue.length; i++) {
        if (this.loopQueue[i].time === 0 || this.matches(transportTime, (this.loopQueue[i].time) / 1000, this.accuracy)) {
          matches++;
          this.triggerSubject.next({event: this.loopQueue[i], position: this.transportInfo.getPositionInfo()});
        }
      }
      this.queueIndex += matches;
    }
  }

  private matches(val1: number, val2: number, accuracy: number): boolean {
    return Math.abs(val2 - val1) < accuracy;
  }


  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


}
