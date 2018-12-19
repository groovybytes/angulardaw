import {Injectable} from '@angular/core';
import {A2dClientService, DesktopApplication, WindowParams} from "angular2-desktop";
import {PadsComponent} from "./pads/pads.component";
import {PushComponent} from "../push/push/push.component";
import {DeviceService} from "./device.service";

@Injectable({
  providedIn: 'root'
})
export class BootstrapperService {

  constructor(private desktopService: A2dClientService,private deviceService:DeviceService) { }

  setupDesktop():void{
    let pads = new DesktopApplication();
    pads.component = PadsComponent;
    pads.id = 'pads';
    pads.title = 'pads';
    pads.singleInstanceMode = false;
    pads.defaultWindowParams = new WindowParams(
      null,
      400,
      100,
      200,
      600,
      'pads',
      true,
      true
    );
    this.desktopService.addApplication(pads);

    let push = new DesktopApplication();
    push.component = PushComponent;
    push.id = 'push';
    push.title = 'push';
    push.singleInstanceMode = true;
    push.defaultWindowParams = new WindowParams(
      null,
      400,
      100,
      800,
      600,
      'push',
      true,
      true
    );
    this.desktopService.addApplication(push);

    setTimeout(() => {
      this.desktopService.createWindow<PushComponent>("push", (push) => {
        this.deviceService.setupPush(push);

      }).then(windowId => {
        this.desktopService.openWindow(windowId);
      })
    }, 500)
  }
}
