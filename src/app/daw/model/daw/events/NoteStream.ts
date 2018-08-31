import * as _ from "lodash";
import {Subscription} from "rxjs/internal/Subscription";
import {Observable, Subject} from "rxjs";
import {NoteTrigger} from "../NoteTrigger";
import {TransportContext} from "../transport/TransportContext";
import {MusicMath} from "../../utils/MusicMath";
import {TransportEvent} from "../transport/TransportEvent";
import {filter} from "rxjs/operators";
import {EventEmitter} from "@angular/core";


export class NoteStream {
  events: Array<NoteTrigger> = [];
  time: EventEmitter<number> = new EventEmitter<number>();
  private lookAhead: number = 0.5;//seconds
  trigger: Observable<{ event: NoteTrigger, offset: number }>;
  private triggerSubject: Subject<{ event: NoteTrigger, offset: number }> = new Subject();
  private timeStamp: number;
  private eventPool: Array<NoteTrigger> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(protected transportContext: TransportContext, private channel: string) {
    this.subscriptions.push(this.transportContext.time
      .pipe(filter(event =>  event && (!channel || ( event.channels.indexOf(channel)>=0))))
      .subscribe(event =>  this.onTransportTime(event.value)));
    this.subscriptions.push(this.transportContext.beforeStart
      .pipe(filter(event =>  event && (!channel || ( event.channels.indexOf(channel)>=0))))
      .subscribe(event => this.initLoopQueue()));
    this.trigger = this.triggerSubject.asObservable();

  }

  private onTransportTime(_transportTime: number): void {
    let endTime =MusicMath.getEndTime(this.transportContext.settings.loopEnd,this.transportContext.settings.global.bpm)/1000;
    let loopTime=_transportTime % endTime;
    this.time.emit(loopTime);
    let timeFactor = 120 / this.transportContext.settings.global.bpm;
    if (this.timeStamp && this.timeStamp > loopTime) {
      this.initLoopQueue();
    }
    this.timeStamp = loopTime;
    if (this.eventPool.length > 0 && this.eventPool[0].time * timeFactor / 1000 <= loopTime) {
      let nextEvents = _.remove(this.eventPool, ev => {
        return ev.time * timeFactor / 1000 <= (loopTime + this.lookAhead)
      });
      nextEvents.forEach(event => {
        let eventClone = _.clone(event);
        eventClone.time = eventClone.time * timeFactor;
        eventClone.length = eventClone.length * timeFactor;
        this.triggerSubject.next({event: eventClone, offset: eventClone.time / 1000 - loopTime});
      });
    }
  }

  private initLoopQueue(): void {
    let startTime = MusicMath.getStartTime(this.transportContext.settings.loopStart, this.transportContext.settings.global.bpm);
    let endTime = MusicMath.getEndTime(this.transportContext.settings.loopEnd, this.transportContext.settings.global.bpm);
    let timeFactor = 120 / this.transportContext.settings.global.bpm;
    this.eventPool = _.clone(this.events.filter(ev => ev.time * timeFactor >= startTime && ev.time * timeFactor <= endTime));
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


}
