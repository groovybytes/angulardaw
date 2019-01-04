import {Injectable} from '@angular/core';
import {A2dClientService} from "angular2-desktop";

@Injectable({
  providedIn: 'root'
})
export class DesktopService {

  constructor(private desktop: A2dClientService) { }



  open<T>(appId,callback?:(component:T)=>void): void {

    this.desktop.createWindow<T>(appId,callback)
      .then(windowId => {
        this.desktop.openWindow(windowId);
      })
      .catch(error => console.warn(error));
  }
}
