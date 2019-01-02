import {EventEmitter} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";
import {AudioPlugin} from "../plugins/AudioPlugin";
import {SamplePlayer} from "./SamplePlayer";
import {Thread} from "../Thread";
import {Notes} from "../../mip/Notes";

export class PlayerSession {

  constructor(private ticker:Thread,private notes:Notes,private plugin:AudioPlugin,bpm:BehaviorSubject<number>){
    this.bpm=bpm;
    this.play.subscribe((event:{note:string,time:number,length:number})=>{
      this._play(plugin,event.note,event.time,event.length,this);
    });
  }

  play: EventEmitter<{ note: string, time: number, length: number }> = new EventEmitter();
  stop: EventEmitter<void> = new EventEmitter();
  subscriptions:Array<Subscription>=[];
  bpm:BehaviorSubject<number>;

  start():void{

  }

  _play(plugin: AudioPlugin, note: string, time: number, length: number, session: PlayerSession): void {

    let detune = 0;
    let node: AudioBufferSourceNode;
    let sample = plugin.getSample(note);
    if (sample.baseNote) detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(note)) * 100;
    sample.trigger(time, length, null, detune)
      .then(_node => {
        node = _node;
      });

    let stopSubscription = session.stop.subscribe(() => {
      stopSubscription.unsubscribe();
      if (node) node.stop(0);
    });

  }


}


