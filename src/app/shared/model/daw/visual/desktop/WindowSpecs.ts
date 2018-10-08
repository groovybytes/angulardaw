import {WindowState} from "./WindowState";

export class WindowSpecs{

  constructor(pluginId:string){
    this.pluginId=pluginId;
  }
  pluginId:string;
  x:number=600;
  y:number=200;
  width:number=600;
  height:number=600;
  state:WindowState=WindowState.CLOSED;

}
