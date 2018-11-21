import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";

export class WindowInfo{
  constructor(id: string, clazz: string, zIndex: number, state: WindowState, position: WindowPosition) {
    this.id = id;
    this.clazz = clazz;
    this.zIndex = zIndex;
    this.state = state;
    this.position = position;
  }

  id:string;
  clazz:string;
  zIndex:number;
  state: WindowState;
  position: WindowPosition;
}
