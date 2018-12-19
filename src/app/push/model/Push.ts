import {Pad} from "./Pad";
import {EventEmitter} from "@angular/core";
import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {EventCategory} from "../../model/daw/devices/EventCategory";
import {PushMode} from "./PushMode";
import {BehaviorSubject} from "rxjs";
import {PushMessage} from "./PushMessage";
import {PushSettings} from "./PushSettings";
import {KeyBindings} from "./KeyBindings";


export class Push {
  listenToKeyboard: boolean = false;
  readonly deviceEvent: EventEmitter<DeviceEvent<any>> = new EventEmitter();
  readonly pads: Array<Pad>=[];
  noteToLearn: string;
  readonly deviceId: string = "push";
  mode:PushMode=PushMode.DEFAULT;
  message:BehaviorSubject<PushMessage>=new BehaviorSubject(null);
  settings:PushSettings;
  keyBindings:Array<KeyBindings>;


  publish<T>(category: EventCategory, event: T): void {
    this.deviceEvent
      .emit(new DeviceEvent<T>(this.deviceId, category, event));
  }

  getPadByNote(note:string):Pad{
    return this.pads.find(pad => pad.info.note===note);
  }

  getPadByPosition(row:number,column:number):Pad{
    return this.pads.find(pad => pad.info.row===row && pad.info.column===column);
  }

  getKeyBinding(pad:Pad):{row:number,column:number,key:string}{
    let keyBinding = this.settings.keyBindings.bindings.find(binding=>binding.column===pad.info.column && binding.row===pad.info.row);
    return keyBinding;
  }
  getKeyBindingFromKeyCode(code:number):{row:number,column:number,key:string}{
    let keyToFind = String.fromCharCode(code).toLowerCase();
    let keyBinding = this.settings.keyBindings.bindings.find(binding=>binding.key===keyToFind);
    return keyBinding;
  }

}
