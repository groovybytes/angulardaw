import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {EventEmitter} from "@angular/core";
import {DeviceEvent} from "../devices/DeviceEvent";
import {BehaviorSubject, Subscription} from "rxjs";
import {NoteEvent} from "../../mip/NoteEvent";
import {EventCategory} from "../devices/EventCategory";
import {NoteOnEvent} from "../../mip/NoteOnEvent";
import {NoteOffEvent} from "../../mip/NoteOffEvent";

export abstract class AudioPlugin {

  private deviceSubscription: Subscription;
  private nodes:Array<{node:AudioBufferSourceNode,note:string}>=[];

  hot:BehaviorSubject<boolean>=new BehaviorSubject(false);

  constructor(protected deviceEvents: EventEmitter<DeviceEvent<any>>){
    this.deviceSubscription = deviceEvents.subscribe(deviceEvent => {
      if (this.hot.getValue()){
        if (deviceEvent.category === EventCategory.NOTE_ON) {
          let event = deviceEvent.data as NoteOnEvent;
          let noteEvent = NoteEvent.default(event.note);
          noteEvent.time = 0;
          noteEvent.length = 200;
          noteEvent.loudness = 1;
          let node = this.startPlay(noteEvent);
          this.nodes.push({node:node,note:noteEvent.note});
        }
        else if (deviceEvent.category===EventCategory.NOTE_OFF){
          let event = deviceEvent.data as NoteOffEvent;
          let index = this.nodes.findIndex(node=>node.note===event.note);
          this.stopPlay(this.nodes[index].node);
          this.nodes.splice(index,1);
        }
      }

    })
  }

  destroy(): void {
    this.deviceSubscription.unsubscribe();
  }

  abstract setInputNode(node:VirtualAudioNode<AudioNode>):void;
  abstract getInputNode():VirtualAudioNode<AudioNode>;
  abstract setOutputNode(node:VirtualAudioNode<AudioNode>):void;
  abstract getOutputNode():VirtualAudioNode<AudioNode>;
  abstract feed(event:NoteEvent, offset:number): any;
  abstract startPlay(event:NoteEvent);
  abstract stopPlay(node:AudioBufferSourceNode): void;
  abstract getNotes():Array<string>;
  abstract getId(): string;
  abstract getInfo(): PluginInfo;
  abstract load(): Promise<void>;
  abstract getInstrumentCategory():InstrumentCategory;
}
