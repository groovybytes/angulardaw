import {PadInfo} from "../push-matrix/model/PadInfo";
import {EventEmitter} from "@angular/core";
import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {EventCategory} from "../../model/daw/devices/EventCategory";
import {PushMode} from "./PushMode";
import {BehaviorSubject} from "rxjs";
import {PushMessage} from "./PushMessage";
import {PushConfig} from "./PushConfig";

export class Push {
  listenToKeyboard: boolean = false;
  readonly deviceEvent: EventEmitter<DeviceEvent<any>> = new EventEmitter();
  readonly pads: Array<PadInfo>=[];
  noteToLearn: string;
  readonly deviceId: string = "push";
  mode:PushMode=PushMode.DEFAULT;
  message:BehaviorSubject<PushMessage>=new BehaviorSubject(null);
  config:PushConfig;


  publish<T>(category: EventCategory, event: T): void {
    this.deviceEvent
      .emit(new DeviceEvent<T>(this.deviceId, category, event));
  }

  getPad(note:string):PadInfo{
    return this.pads.find(pad => pad.note===note);
  }

}
