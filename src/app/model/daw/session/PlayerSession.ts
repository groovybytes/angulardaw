import {EventEmitter} from "@angular/core";
import {BehaviorSubject, Subscription} from "rxjs";
import {AudioPlugin} from "../plugins/AudioPlugin";
import {SamplePlayer} from "./SamplePlayer";
import {Thread} from "../Thread";
import {Notes} from "../../mip/Notes";
import {ADSREnvelope} from "../../mip/ADSREnvelope";
import {NoteEvent} from "../../mip/NoteEvent";

export class PlayerSession {

  constructor(private ticker:Thread,private notes:Notes,private plugin:AudioPlugin,bpm:BehaviorSubject<number>){
    this.bpm=bpm;
    this.play.subscribe(event=>{
      this._play(plugin,event,this);
    });
  }

  play: EventEmitter<NoteEvent> = new EventEmitter();
  stop: EventEmitter<void> = new EventEmitter();
  subscriptions:Array<Subscription>=[];
  bpm:BehaviorSubject<number>;

  start():void{

  }

  _play(plugin: AudioPlugin, event:NoteEvent, session: PlayerSession): void {

    let detune = 0;
    let node: AudioBufferSourceNode;
    let sample = plugin.getSample(event.note);
    if (sample.baseNote) detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(event.note)) * 100;
    sample.trigger(event,null, detune)
      .then((result:{node:AudioBufferSourceNode,gainNode:GainNode}) => {
        node = result.node;
      });

    let stopSubscription = session.stop.subscribe(() => {
      stopSubscription.unsubscribe();
      if (node) node.stop(0);
    });

  }


}


