import {WindowState} from "./WindowState";

export class WindowSpecs{

  constructor(pluginId:string){
    this.pluginId=pluginId;
  }
  pluginId:string;
  x:number=200;
  y:number=200;
  width:number=400;
  height:number=400;
  state:WindowState=WindowState.CLOSED;

}
