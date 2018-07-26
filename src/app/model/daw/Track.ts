import {TrackEvent} from "./TrackEvent";
import {Observable} from "rxjs/internal/Observable";
import {Subscription} from "rxjs/internal/Subscription";
import {TrackEventHandler} from "./TrackEventHandler";
import {EventEmitter, Inject} from "@angular/core";

export class Track<T extends TrackEventHandler>{
  events:Array<TrackEvent<any> >=[];

  private subscriptions:Array<Subscription>=[];
  private threshold=0.1;
  private i:number=0;
  private lookAhead:number=10;

  constructor(private handler:T,private timer:Observable<number>,start:EventEmitter<void>, @Inject("lodash") private _){
    this.subscriptions.push(timer.subscribe(time=>{
      if (time===0) this.i=0;
      this.onTime(time);
    }));
    this.subscriptions.push(start.subscribe(()=>{
      this.i=0;
    }));

  }

  private isMatch(transportTime: number, noteTime: number): boolean {
    let diff = transportTime - noteTime/1000;
    return diff===0 || Math.abs(diff) <= this.threshold;
  }

  private getMatches(time:number,events:Array<TrackEvent<any>>):Array<TrackEvent<any>>{
    let matches = events.filter(event=>this.isMatch(time,event.time));
    return matches;
  }

  private onTime(time:number):void{

    let nextCandidates = this.events.slice(this.i,this.lookAhead);
    let matches = this.getMatches(time,nextCandidates);
    if (matches.length>0){
      this.i+=matches.length;
      this.handler.next(matches);
    }

    /*   if (this.isMatch(notes[i].time,position.time)){

         let event = new MidiEvent();
         event.midi=notes[i].midi;
         event.duration=notes[i].duration;
         this.midiEvent.next([event]);
         i++;
       }*/
  }

  addEvent(event:TrackEvent<any>):void{
    let insertIndex = this._.sortedIndexBy(this.events, {'time':event.time}, event=>event.time);
    this.events.splice(insertIndex,0,event);
  }

  destroy(){
    this.subscriptions.forEach(subsription=>subsription.unsubscribe());
  }
}
