import * as _ from "lodash";
import {Subscription} from "rxjs/internal/Subscription";
import {Observable, Subject} from "rxjs";
import {NoteTrigger} from "../NoteTrigger";
import {TransportReader} from "../transport/TransportReader";
import {TransportEvents} from "../transport/TransportEvents";


export class PerformanceStreamer {
  private queue: Array<NoteTrigger> = [];
  private lookAhead: number = 1;//seconds
  private subscriptions: Array<Subscription> = [];
  trigger: Observable<{ event: NoteTrigger, offset: number }>;
  private triggerSubject: Subject<{ event: NoteTrigger, offset: number }> = new Subject();
  private timeStamp:number;
  private eventPool: Array<NoteTrigger> = [];

  constructor(events: Array<NoteTrigger>,private transport:TransportReader,private transportEvents:TransportEvents) {
    this.queue = events;
    this.trigger = this.triggerSubject.asObservable();
    this.subscriptions.push(this.transportEvents.time.subscribe(time => this.onTransportTime(time)));
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

 /* private getTickTime():number{
    return MusicMath.getTickTime(this.transport.getBpm(), this.transport.getQuantization());
  }*/



  private initLoopQueue(): void {
    let startTime = this.transport.getStartTime();
    let endTime = this.transport.getEndTime();

    this.eventPool = _.clone(this.queue.filter(ev => ev.time >= startTime && ev.time <= endTime));

  }

  updateEventQueue(events: Array<NoteTrigger>): void {
    this.queue = events;
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


}
