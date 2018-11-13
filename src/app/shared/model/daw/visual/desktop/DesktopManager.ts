import {WindowSpecs} from "./WindowSpecs";
import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";

export class DesktopManager{

  windows:Array<WindowSpecs>=[];

  getWindow(id:string):WindowSpecs{
    return this.windows.find(window=>window.id===id);
  }

  getWindowClass(id:string):string{
    let window = this.getWindow(id);

    if (window.position===WindowPosition.TOP) return "window-top";
    else if (window.position===WindowPosition.BOTTOM) return "window-bottom";
    else return "";
  }

  addWindow(pluginId:string):void{
    let spec = new WindowSpecs(pluginId);
    this.windows.push(spec);
  }

  isOpen(id:string):boolean{
    let window = this.getWindow(id);
    return window?window.state===WindowState.NORMAL:false;
  }
  getOpenWindows():Array<WindowSpecs>{
    return this.windows.filter(window=>window.state===WindowState.NORMAL);
  }

  openWindow(id:string):void{
    let window = this.getWindow(id);
    if (window) window.state=WindowState.NORMAL;
  }
  closeWindow(id:string):void{
    let window = this.getWindow(id);
    if (window) window.state=WindowState.CLOSED;
  }

  toggleWindow(id:string):void{
    let window = this.getWindow(id);
    if (window){
      if (window.state!=WindowState.NORMAL) window.state=WindowState.NORMAL;
      else window.state=WindowState.CLOSED;
    }

  }

}
