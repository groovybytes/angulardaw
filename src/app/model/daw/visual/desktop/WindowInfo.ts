import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";

export class WindowInfo{
  constructor(clazz: string, zIndex: number, state: WindowState, position: WindowPosition) {
    this.clazz = clazz;
    this.zIndex = zIndex;
    this.state = state;
    this.position = position;
  }
  clazz:string;
  zIndex:number;
  state: WindowState;
  position: WindowPosition;
}
