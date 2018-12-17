import {NoteStream} from "./NoteStream";

import {BehaviorSubject, Subscription} from "rxjs/index";
import {TrackControlParameters} from "./TrackControlParameters";
import {NoteLength} from "../mip/NoteLength";
import {TransportContext} from "./transport/TransportContext";
import {EventEmitter} from "@angular/core";
import * as _ from "lodash";
import {NoteEvent} from "../mip/NoteEvent";
import {AudioPlugin} from "./plugins/AudioPlugin";


export class Pattern {

  id: string;
  length: number = 8;//beats
  readonly events: Array<NoteEvent> = [];
  notes: Array<string> = [];
  time:EventEmitter<number>=new EventEmitter<number>();
  quantizationEnabled:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(true);
  quantization: BehaviorSubject<NoteLength> = new BehaviorSubject<NoteLength>(null);
  transportContext: TransportContext;
  marked:boolean=false;
  noteInserted:EventEmitter<NoteEvent>=new EventEmitter();
  noteUpdated:EventEmitter<NoteEvent>=new EventEmitter();
  noteRemoved:EventEmitter<NoteEvent>=new EventEmitter();
  private subscriptions: Array<Subscription> = [];
  stream: NoteStream;

  constructor(
    id: string,
    notes: Array<string>,
    transportContext: TransportContext,
    private plugin: AudioPlugin,
    private _quantization: NoteLength,
    private  controlParameters: TrackControlParameters
/*    private channels?:Array<string>*/
  ) {
    this.id = id;
    this.transportContext = transportContext;
    this.stream = new NoteStream(transportContext,this.id);
    this.stream.events = this.events;
    this.subscriptions.push(this.stream.time.subscribe(time=>this.time.emit(time)));
    this.notes = notes;
    this.quantization.next(_quantization);
    this.subscriptions.push(this.stream.trigger.subscribe(event => this.onNextEvent(event.offset, event.event)));
  }


  private onNextEvent(offset: number, event: NoteEvent): void {
    if (this.controlParameters.mute.getValue() === false) this.plugin.feed(event, offset);
  }


  insertNote(note: NoteEvent, publish?:boolean): void {
    let index = _.sortedIndexBy(this.events, {'time': note.time}, d => d.time);
    this.events.splice(index, 0, note);
    if (publish) this.noteInserted.emit(note);
  }

  removeNote(id: string,publish?:boolean): void {
    let index = this.events.findIndex(ev => ev.id === id);
    let event=this.events[index];
    this.events.splice(index, 1);
    if (publish) this.noteRemoved.emit(event);

  }

  destroy():void{
    this.subscriptions.forEach(subscr=>subscr.unsubscribe());
  }

  getLengthInBars():number{
    return this.length/this.transportContext.settings.global.beatUnit;
  }

  setLengthInBars(bars:number):void{
    this.length=bars*this.transportContext.settings.global.beatUnit;
    this.transportContext.settings.loopEnd=this.length;
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
