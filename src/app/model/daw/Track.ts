import { TrackEvent } from './TrackEvent';
import { Subscription } from 'rxjs/internal/Subscription';
import { TrackEventHandler } from './TrackEventHandler';
import { Inject } from '@angular/core';
import { TransportProxy } from './TransportProxy';

export class Track<T extends TrackEventHandler>{
  events:Array<TrackEvent<any> >=[];

  private subscriptions:Array<Subscription>=[];

  constructor(private handler:T,private transport:TransportProxy, @Inject("lodash") private _){
    this.subscriptions.push(transport.trackEvent.subscribe((events:Array<TrackEvent<any>>)=>{
      this.handler.next(events);
    }));
  }


  addEvent(event:TrackEvent<any>):void{
    let insertIndex = this._.sortedIndexBy(this.events, {'time':event.time}, event=>event.time);
    this.events.splice(insertIndex,0,event);
    this.transport.setTrackEvents(this.events);
  }

  destroy(){
    this.subscriptions.forEach(subsription=>subsription.unsubscribe());
  }
}
