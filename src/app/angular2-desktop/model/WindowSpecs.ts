import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";
import * as _ from "lodash";

export class WindowSpecs{

  constructor(){
    this.id=_.uniqueId("window_");
  }

  readonly id:string;
  x:number=200;
  y:number=50;
  width:number=800;
  height:number=600;
  state:WindowState=WindowState.CLOSED;
  position:WindowPosition=WindowPosition.FLOATING;

}
