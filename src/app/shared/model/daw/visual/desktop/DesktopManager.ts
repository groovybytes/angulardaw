import {WindowSpecs} from "./WindowSpecs";
import {WindowState} from "./WindowState";

export class DesktopManager{

  windows:Array<WindowSpecs>=[];

  getWindow(id:string):WindowSpecs{
    return this.windows.find(window=>window.id===id);
  }
  addWindow(pluginId:string):void{
    let spec = new WindowSpecs(pluginId);
    this.windows.push(spec);
  }

  isOpen(id:string):boolean{
    let window = this.getWindow(id);
    return window?window.state===WindowState.OPENED:false;
  }
  getOpenWindows():Array<WindowSpecs>{
    return this.windows.filter(window=>window.state===WindowState.OPENED);
  }

  openWindow(id:string):void{
    let window = this.getWindow(id);
    if (window) window.state=WindowState.OPENED;
  }
  closeWindow(id:string):void{
    let window = this.getWindow(id);
    if (window) window.state=WindowState.CLOSED;
  }

  toggleWindow(id:string):void{
    let window = this.getWindow(id);
    if (window){
      if (window.state!=WindowState.OPENED) window.state=WindowState.OPENED;
      else window.state=WindowState.CLOSED;
    }

  }

}
