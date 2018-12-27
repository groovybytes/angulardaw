

import {BehaviorSubject, Subscription} from "rxjs/index";
import {TrackControlParameters} from "./TrackControlParameters";
import {NoteLength} from "../mip/NoteLength";
import {TransportContext} from "./transport/TransportContext";
import {EventEmitter} from "@angular/core";
import * as _ from "lodash";
import {NoteEvent} from "../mip/NoteEvent";
import {AudioPlugin} from "./plugins/AudioPlugin";
import {TriggerSpec} from "./TriggerSpec";
import {ScriptEngine} from "../../shared/services/scriptengine.service";
import {MusicMath} from "../utils/MusicMath";


export class Pattern {

  id: string;
  length: number = 8;//beats
  readonly events: Array<NoteEvent> = [];
  triggers: Array<TriggerSpec> = [];
  quantizationEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  quantization: BehaviorSubject<NoteLength> = new BehaviorSubject<NoteLength>(null);
  transportContext: TransportContext;
  marked: boolean = false;
  noteInserted: EventEmitter<NoteEvent> = new EventEmitter();
  noteUpdated: EventEmitter<NoteEvent> = new EventEmitter();
  noteRemoved: EventEmitter<NoteEvent> = new EventEmitter();
  private subscriptions: Array<Subscription> = [];
  plugin: AudioPlugin;

  constructor(
    id: string,
    triggers: Array<TriggerSpec>,
    private scriptEngine: ScriptEngine,
    transportContext: TransportContext,
    plugin: AudioPlugin,
    private _quantization: NoteLength,
    private  controlParameters: TrackControlParameters
    /*    private channels?:Array<string>*/
  ) {
    this.id = id;
    this.transportContext = transportContext;

    this.triggers = triggers;
    this.quantization.next(_quantization);
    this.plugin=plugin;
  }


  /*private onNextEvent(offset: number, event: NoteEvent): void {
    if (this.controlParameters.mute.getValue() === false) this.plugin.feed(event, offset);
  }*/

  getNotes():Array<string>{
    return this.triggers.map(trigger=>trigger.note);
  }

  insertNote(event: NoteEvent, publish?: boolean): boolean {

    let index = this.triggers.findIndex(trigger => trigger.note === event.note);

    if (index >= 0) {
      let index = _.sortedIndexBy(this.events, {'time': event.time}, d => d.time);
      this.events.splice(index, 0, event);
      if (publish) this.noteInserted.emit(event);

      return true;
    } else return false;

  }

  removeNote(id: string, publish?: boolean): void {
    let index = this.events.findIndex(ev => ev.id === id);
    let event = this.events[index];
    this.events.splice(index, 1);
    if (publish) this.noteRemoved.emit(event);

  }

  destroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }

  getLengthInBars(): number {
    return this.length / this.transportContext.settings.global.beatUnit;
  }

  getLength():number{
    return MusicMath.getEndTime(this.length,this.transportContext.settings.global.bpm);
  }

  setLengthInBars(bars: number): void {
    this.length = bars * this.transportContext.settings.global.beatUnit;
    this.transportContext.settings.loopEnd = this.length;
  }


}
