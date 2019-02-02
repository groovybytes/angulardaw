import {ElementRef, Inject, Injectable} from '@angular/core';
import {NoteOffEvent} from "../../model/mip/NoteOffEvent";
import {EventCategory} from "../../model/daw/devices/EventCategory";
import {Push} from "../model/Push";
import {NoteOnEvent} from "../../model/mip/NoteOnEvent";
import {PushMode} from "../model/PushMode";
import {PadInfo} from "../model/PadInfo";
import {Pad} from "../model/Pad";

@Injectable({
  providedIn: 'root'
})
export class PushMatrixService {

  constructor(@Inject("Push") private push: Push) {
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.push.listenToKeyboard && this.push.mode === PushMode.DEFAULT) {
      let keyBinding = this.push.getKeyBindingFromKeyCode(event.keyCode);
      let pad = this.push.getPadByPosition(keyBinding.row, keyBinding.column);
      if (pad) {
        pad.state.next(0);
        this.push.publish(EventCategory.NOTE_OFF, NoteOffEvent.default(pad.info.note));
      } else console.log("pad not found");
    } else if (this.push.mode === PushMode.LEARN_KEY) {
      let pad = this.push.getPadByNote(this.push.noteToLearn);
      this.updateBinding(pad, String.fromCharCode(event.keyCode));
      pad.state.next(0);
      this.push.mode = PushMode.DEFAULT;
    }
  }

  onKeyDown(event: KeyboardEvent): void {

    if (this.push.listenToKeyboard && this.push.mode === PushMode.DEFAULT && !event.repeat) {
      let keyBinding = this.push.getKeyBindingFromKeyCode(event.keyCode);
      let pad = this.push.getPadByPosition(keyBinding.row, keyBinding.column);

      if (pad && pad.state.getValue() === 0) { // recheck here: event.repeat not trustable :)
        pad.state.next(1);
        this.push.publish(EventCategory.NOTE_ON, NoteOnEvent.default(pad.info.note));
      }
    }
  }

  onMouseDown(event: MouseEvent): void {


    let row = parseInt($(event.target).attr("data-row"));
    let column = parseInt($(event.target).attr("data-column"));
    let pad = this.push.getPadByPosition(row, column);

    if (this.push.mode === PushMode.DEFAULT) {

      pad.state.next(1);
      this.push.publish(EventCategory.NOTE_ON, NoteOnEvent.default(pad.info.note));
    } else if (this.push.mode === PushMode.LEARN_KEY) {
      this.push.noteToLearn = pad.info.note;
      pad.state.next(2);
    } else throw new Error("not implemented");


  }

  onMouseUp(event: MouseEvent): void {
    let row = parseInt($(event.target).attr("data-row"));
    let column = parseInt($(event.target).attr("data-column"));
    let pad = this.push.getPadByPosition(row, column);

    if (this.push.mode === PushMode.DEFAULT) {
      pad.state.next(0);
      this.push.publish(EventCategory.NOTE_OFF, NoteOffEvent.default(pad.info.note));
    }

  }


  /* onMouseDown(element: ElementRef): void {

     let note = $(element.nativeElement).attr("data-note");
     let pad = this.push.getPadByNote(note);

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
     let pad = this.push.getPadByNote(note);

     if (this.push.mode === PushMode.DEFAULT) {
       pad.state.next(0);
       this.push.publish(EventCategory.NOTE_OFF, NoteOffEvent.default(note));
     }

   }*/

  private updateBinding(pad: Pad, key: string): void {
    let keyBindings = this.push.settings.keyBindings;

    let keyBinding = keyBindings.bindings.find(binding => binding.column === pad.info.column && binding.row === pad.info.row);
    if (!keyBinding) {
      let newBinding = {row: pad.info.row, column: pad.info.column, key: key.toLowerCase()};
      keyBindings.bindings.push(newBinding);
    } else {
      keyBinding.key = key;
    }


  }
}
