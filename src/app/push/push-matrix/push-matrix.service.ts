import {ElementRef, Inject, Injectable} from '@angular/core';
import {NoteOffEvent} from "../../model/mip/NoteOffEvent";
import {EventCategory} from "../../model/daw/devices/EventCategory";
import {Push} from "../model/Push";
import {NoteOnEvent} from "../../model/mip/NoteOnEvent";
import {PadInfo} from "./model/PadInfo";
import {PushMode} from "../model/PushMode";

@Injectable({
  providedIn: 'root'
})
export class PushMatrixService {

  constructor(@Inject("Push") private push: Push) {
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.push.listenToKeyboard && this.push.mode===PushMode.DEFAULT){
      let pad = this.push.pads.find(pad => this.keyEquals(event.keyCode, pad.keyBinding));
      if (pad) this.push.publish(EventCategory.NOTE_OFF, NoteOffEvent.default(pad.note));
    }
    else if (this.push.mode === PushMode.LEARN_KEY) {
      let pad = this.push.pads.find(pad => pad.note===this.push.noteToLearn);
      pad.keyBinding=String.fromCharCode(event.keyCode);
      this.push.mode=PushMode.DEFAULT;
    }
  }

  onKeyDown(event: KeyboardEvent): void {

    if (this.push.listenToKeyboard && this.push.mode===PushMode.DEFAULT && !event.repeat) {
      let pad = this.push.pads.find(pad => this.keyEquals(event.keyCode, pad.keyBinding));
      if (pad) {
        this.push.publish(EventCategory.NOTE_ON, NoteOnEvent.default(pad.note));
      }
    }
  }

  onMouseDown(element: ElementRef): void {
    let note = $(element.nativeElement).attr("data-note");
    let pad = this.push.getPad(note);
    if (this.push.mode === PushMode.DEFAULT) {

      pad.state.next(1);
      this.push.publish(EventCategory.NOTE_ON, NoteOnEvent.default(note));
    } else if (this.push.mode === PushMode.LEARN_KEY) {
      this.push.noteToLearn = note;
      pad.state.next(2);
    } else throw new Error("not implemented");


  }

  onMouseUp(element: ElementRef): void {
    let note = $(element.nativeElement).attr("data-note");
    let pad = this.push.getPad(note);

    if (this.push.mode === PushMode.DEFAULT) {
      pad.state.next(0);
      this.push.publish(EventCategory.NOTE_OFF, NoteOffEvent.default(note));
    }

  }

  private keyEquals(eventKey: number, stringCode: string): boolean {
    return stringCode !== null && String.fromCharCode(eventKey).toLowerCase() === stringCode.toLowerCase();
  }
}
