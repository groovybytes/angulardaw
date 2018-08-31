import {NoteStream} from "./events/NoteStream";
import {NoteTrigger} from "./NoteTrigger";
import {WstPlugin} from "./WstPlugin";
import {BehaviorSubject, Subscription} from "rxjs/index";
import {TrackControlParameters} from "./TrackControlParameters";
import {NoteLength} from "../mip/NoteLength";
import {TransportContext} from "./transport/TransportContext";
import {EventEmitter} from "@angular/core";
import * as _ from "lodash";


export class Pattern {

  id: string;
  length: number = 8;//beats
  readonly events: Array<NoteTrigger> = [];
  notes: Array<string> = [];
  time:EventEmitter<number>=new EventEmitter<number>();
  quantizationEnabled:BehaviorSubject<boolean>=new BehaviorSubject<boolean>(true);
  quantization: BehaviorSubject<NoteLength> = new BehaviorSubject<NoteLength>(null);
  transportContext: TransportContext;
  private subscriptions: Array<Subscription> = [];
  private stream: NoteStream;

  constructor(
    id: string,
    notes: Array<string>,
    transportContext: TransportContext,
    private plugin: WstPlugin,
    private _quantization: NoteLength,
    private  controlParameters: TrackControlParameters,
    private gainNode: GainNode
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


  private onNextEvent(offset: number, event: NoteTrigger): void {
    if (this.controlParameters.mute.getValue() === false) this.plugin.feed(event, offset, this.gainNode);
  }


  insertNote(note: NoteTrigger): void {
    note.id = this.guid();
    let index = _.sortedIndexBy(this.events, {'time': note.time}, d => d.time);
    this.events.splice(index, 0, note);
  }

  removeNote(id: string): void {
    let index = this.events.findIndex(ev => ev.id === id);
    this.events.splice(index, 1);
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
