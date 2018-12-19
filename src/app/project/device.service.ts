import {Inject, Injectable} from '@angular/core';
import {PushComponent} from "../push/push/push.component";
import {DawInfo} from "../model/DawInfo";
import {PushSettings} from "../push/model/PushSettings";
import {KeyBindings} from "../push/model/KeyBindings";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(@Inject("daw") private daw: DawInfo) {
  }

  setupPush(push: PushComponent): void {
    let project = this.daw.project.getValue();
    push.deviceEvent.subscribe(event => {
      project.deviceEvents.emit(event);
    });
    //todo:unsubscribe
    if (!this.daw.project.getValue().pushSettings) {
      push.settings = project.pushSettings = new PushSettings();
      push.settings.columns = 7;
      push.settings.rows = 3;
      push.settings.baseNote="C2";
      push.settings.keyBindings=KeyBindings.default;
    }
    else push.settings = project.pushSettings;

  }
}
