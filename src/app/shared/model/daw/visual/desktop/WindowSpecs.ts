import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";

export class WindowSpecs{

  constructor(id:string){
    this.id=id;
  }

  id:string;
  x:number=200;
  y:number=50;
  width:number=800;
  height:number=600;
  state:WindowState=WindowState.CLOSED;
  position:WindowPosition=WindowPosition.ABSOLUTE;

}
