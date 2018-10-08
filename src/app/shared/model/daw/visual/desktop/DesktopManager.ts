import {WindowSpecs} from "./WindowSpecs";
import {WindowState} from "./WindowState";

export class DesktopManager{

  windows:Array<WindowSpecs>=[];

  addWindow(pluginId:string):void{
    let spec = new WindowSpecs(pluginId);
    this.windows.push(spec);
  }

  getOpenWindows():Array<WindowSpecs>{
    return this.windows.filter(window=>window.state===WindowState.OPENED);
  }

  openPluginWindow(pluginId:string):void{
    this.windows.find(window=>window.pluginId===pluginId).state=WindowState.OPENED;
  }
  closePluginWindow(pluginId:string):void{
    this.windows.find(window=>window.pluginId===pluginId).state=WindowState.CLOSED;
  }
}
