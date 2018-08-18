import * as _ from "lodash";
import {Subscription} from "rxjs/internal/Subscription";
import {TransportEvents} from "./TransportEvents";
import {TransportInfo} from "../TransportInfo";
import {Observable, Subject} from "rxjs";
import {TransportPosition} from "../TransportPosition";
import {NoteTriggerViewModel} from "../../viewmodel/NoteTriggerViewModel";

export class PerformanceStreamer {
  private queue: Array<NoteTriggerViewModel> = [];
  private loopQueue: Array<NoteTriggerViewModel> = [];
  private queueIndex: number = 0;
  private lookAhead:number=2;//seconds
  private subscriptions: Array<Subscription> = [];
  trigger: Observable<{ event: NoteTriggerViewModel, offset: number }>;
  private triggerSubject: Subject<{ event: NoteTriggerViewModel, offset: number }> = new Subject();

  constructor(events: Array<NoteTriggerViewModel>, protected transportEvents: TransportEvents, protected transportInfo: TransportInfo) {
    this.queue = events;
    this.trigger = this.triggerSubject.asObservable();
    this.subscriptions.push(this.transportEvents.time.subscribe(time => this.onTransportTime(time)));
    this.subscriptions.push(this.transportEvents.timeReset.subscribe(() => this.initLoopQueue()));
  }

  private onTransportTime(transportTime: number): void {

    console.log(transportTime);
    if (this.loopQueue.length > 0 && this.queueIndex < this.loopQueue.length) {
      let nextEvents = this.loopQueue.filter(d=>!d._triggered && d.time/1000>=transportTime && d.time/1000<=transportTime+this.lookAhead);
      nextEvents.forEach(event=>{
        this.triggerSubject.next({event: event, offset: event.time/1000-transportTime});
        event._triggered=true;
      });
    }
  }

  private initLoopQueue():void{
    let startTime = this.transportInfo.getStartTime();
    let endTime = this.transportInfo.getEndTime();

    this.loopQueue = this.queue.filter(d => d.time >= startTime && d.time <= endTime);
    this.loopQueue.forEach(e=>e._triggered=false);
  }

  updateEventQueue(events: Array<NoteTriggerViewModel>):void{
    this.queue = events;
    this.initLoopQueue();
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


}
