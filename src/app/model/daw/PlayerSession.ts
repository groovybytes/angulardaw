import {EventEmitter} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";
import {AudioPlugin} from "./plugins/AudioPlugin";
import {SamplePlayer} from "./SamplePlayer";

export class PlayerSession {

  constructor(private plugin:AudioPlugin,private samplePlayer:SamplePlayer,bpm:BehaviorSubject<number>){
    this.bpm=bpm;
    this.play.subscribe((event:{note:string,time:number,length:number})=>{
      samplePlayer.play(plugin,event.note,event.time,event.length,this);
    });

  }

  play: EventEmitter<{ note: string, time: number, length: number }> = new EventEmitter();
  stop: EventEmitter<void> = new EventEmitter();
  subscriptions:Array<Subscription>=[];
  bpm:BehaviorSubject<number>;



}


