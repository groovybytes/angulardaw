/*
import {Subscription} from "rxjs/internal/Subscription";
import {Observable, Subject} from "rxjs";

import {TransportContext} from "./transport/TransportContext";
import {MusicMath} from "../utils/MusicMath";
import {filter} from "rxjs/operators";
import {EventEmitter} from "@angular/core";
import {NoteEvent} from "../mip/NoteEvent";
import {ScriptEngine} from "../../shared/services/scriptengine.service";
import {AudioPlugin} from "./plugins/AudioPlugin";


export class NoteStream {
  events: Array<NoteEvent> = [];
  time: EventEmitter<number> = new EventEmitter<number>();
  private lookAhead: number = 1.5;//5 notes
  trigger: Observable<{ event: NoteEvent, offset: number }>;
  private triggerSubject: Subject<{ event: NoteEvent, offset: number }> = new Subject();
  private index: number = 0;
  private lastTime: number = 1000000000000;
  private timeStamp;

  private debugId: string;
  private lastIndex:number;

  private subscriptions: Array<Subscription> = [];
  transportTimeOffset: number = 0;
  private queue: Array<NoteEvent> = [];

  constructor(private plugin: AudioPlugin, private scriptEngine: ScriptEngine, protected transportContext: TransportContext, private channel: string) {

    this.debugId = this.guid();
    this.subscriptions.push(this.transportContext.time
      .pipe(filter(event => event && (!channel || (event.channels.indexOf(channel) >= 0))))
      .subscribe(event => {

        this.onTransportTime(event.value);


      }));
    this.subscriptions.push(this.transportContext.beforeStart
      .pipe(filter(event => event && (!channel || (event.channels.indexOf(channel) >= 0))))
      .subscribe(event => this.initLoopQueue()));
    this.trigger = this.triggerSubject.asObservable();

  }

  private onTransportTime(_transportTime: number): void {


    let actualTransportTime = _transportTime - this.transportTimeOffset;

    let endTime = MusicMath.getEndTime(this.transportContext.settings.loopEnd, this.transportContext.settings.global.bpm) / 1000;
    let loopTime = actualTransportTime % endTime;


    let timeFactor = 120 / this.transportContext.settings.global.bpm;


    for (let i = this.index; i < this.queue.length; i++) {
      if (this.queue[i].time < loopTime+this.lookAhead){
        let eventClone = new NoteEvent(this.queue[i].note, this.queue[i].time, this.queue[i].length, this.queue[i].loudness, this.queue[i].articulation);
        eventClone.time = this.queue[i].time * timeFactor;
        eventClone.length = this.queue[i].length * timeFactor;

        let offset = eventClone.time / 1000 - loopTime;
        if (offset < 0) offset = 0;
        this.scriptEngine.setImmediate(() => {
          this.plugin.feed(eventClone, offset);
        });
      }
      else{
        this.index=i;
        break;
      }
    }



    let repeat = true;

   /!* while (repeat) {
      let nextEvent = this.queue[this.index];
      let eventTime = nextEvent.time * timeFactor / 1000;
      if (eventTime <= (loopTime + this.lookAhead)) {
        let eventClone = new NoteEvent(nextEvent.note, nextEvent.time, nextEvent.length, nextEvent.loudness, nextEvent.articulation);
        eventClone.time = nextEvent.time * timeFactor;
        eventClone.length = nextEvent.length * timeFactor;


        //if (this.controlParameters.mute.getValue() === false)
        let offset = eventClone.time / 1000 - loopTime;
        if (offset < 0) offset = 0;
        this.scriptEngine.setImmediate(() => {
          this.plugin.feed(eventClone, offset);
        });

        //this.triggerSubject.next({event: eventClone, offset: eventClone.time / 1000 - loopTime});//eventClone.time / 1000 - loopTime});
        this.nextIndex();
        repeat = true;
      } else repeat = false;
    }*!/

    this.time.emit(loopTime);


    /!* if (this.index < this.queue.length) {
       let nextEvent = this.queue[this.index];
       if (nextEvent.time * timeFactor / 1000 < loopTime) {
         let eventClone = new NoteEvent(nextEvent.note, nextEvent.time, nextEvent.length, nextEvent.loudness, nextEvent.articulation);
         eventClone.time = nextEvent.time * timeFactor;
         eventClone.length = nextEvent.length * timeFactor;

         this.scriptEngine.setImmediate(() => {
           this.triggerSubject.next({event: eventClone, offset: eventClone.time / 1000 - loopTime});//eventClone.time / 1000 - loopTime});
           this.nextIndex();
         });

       }
     }*!/

    /!* nextEvents.forEach(nextEvent=>{
       let eventClone = new NoteEvent(nextEvent.note, nextEvent.time, nextEvent.length, nextEvent.loudness, nextEvent.articulation);
       eventClone.time = nextEvent.time * timeFactor;
       eventClone.length = nextEvent.length * timeFactor;
       this.triggerSubject.next({event: eventClone, offset: eventClone.time / 1000 - loopTime});
     });*!/


    /!* let nextEventTime = nextEvent.time * timeFactor / 1000;


     if (nextEvent && nextEventTime  <= loopTime){

       let eventClone = new NoteEvent(nextEvent.note, nextEvent.time, nextEvent.length, nextEvent.loudness, nextEvent.articulation);
       eventClone.time = nextEvent.time * timeFactor;
       eventClone.length = nextEvent.length * timeFactor;
       this.triggerSubject.next({event: eventClone, offset: eventClone.time / 1000 - loopTime});
       this.nextIndex();
     }*!/


  }

  setTimeOffset(offset: number): void {
    this.transportTimeOffset = offset;
  }

  private nextIndex(): void {
    this.index += 1;
    //this.index=(this.index+1)%this.queue.length;
    //console.log("index is now "+this.index);
  }

  private debug(msg): void {
    //console.log(this.debugId+" "+msg)
  }

  private initLoopQueue(): void {
    //console.log("init");
    this.index = 0;
    let startTime = MusicMath.getStartTime(this.transportContext.settings.loopStart, this.transportContext.settings.global.bpm);
    let endTime = MusicMath.getEndTime(this.transportContext.settings.loopEnd, this.transportContext.settings.global.bpm);
    let timeFactor = 120 / this.transportContext.settings.global.bpm;

    this.queue = this.events
      .filter(ev => ev.time * timeFactor >= startTime && ev.time * timeFactor <= endTime);
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


}
*/
