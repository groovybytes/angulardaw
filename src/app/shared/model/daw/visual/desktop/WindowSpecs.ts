import {WindowState} from "./WindowState";

export class WindowSpecs{

  constructor(id:string){
    this.id=id;
  }
  id:string;
  x:number=600;
  y:number=200;
  width:number=600;
  height:number=600;
  state:WindowState=WindowState.CLOSED;

}
