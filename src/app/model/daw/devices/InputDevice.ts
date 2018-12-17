import {EventEmitter} from "@angular/core";

import {DeviceEvent} from "./DeviceEvent";

export class InputDevice{

  nextEvent:EventEmitter<DeviceEvent<any> >=new EventEmitter();

}
