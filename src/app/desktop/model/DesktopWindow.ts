import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";
import {BehaviorSubject} from "rxjs";
import {WindowInfo} from "./WindowInfo";

export class DesktopWindow {

  constructor(id: string, state: WindowState, position: WindowPosition) {
    this.id = id;
    this.state.next(state);
    this.position.next(position);
  }

  clazz: string;
  id: string;
  zIndex: number = 1;
  zIndexTmp: number = 1;
  order: number = 0;
  state: BehaviorSubject<WindowState> = new BehaviorSubject(WindowState.NORMAL);
  position: BehaviorSubject<WindowPosition> = new BehaviorSubject(WindowPosition.LEFT);


  getInfo(): WindowInfo {
    return new WindowInfo(this.id,this.clazz, this.zIndex, this.state.getValue(), this.position.getValue());
  }

  updateClass():void{
    this.clazz = "window";
    if (this.position.getValue() === WindowPosition.TOP) this.clazz += " window-top";
    else if (this.position.getValue() === WindowPosition.BOTTOM) this.clazz += " window-bottom";
    else if (this.position.getValue() === WindowPosition.LEFT) this.clazz += " window-left";
    else if (this.position.getValue() === WindowPosition.RIGHT) this.clazz += " window-right";
    else if (this.position.getValue() === WindowPosition.SIDEBAR_LEFT) this.clazz += " sidebar-left";
    else if (this.position.getValue() === WindowPosition.FIXED_TOP) this.clazz += " fixed-top";
    else if (this.position.getValue() === WindowPosition.FIXED_BOTTOM) this.clazz += " fixed-bottom";

    if (this.state.getValue() === WindowState.CLOSED) this.clazz += " window-closed";
    else if (this.state.getValue() === WindowState.MAXIMIZED) this.clazz += " window-maximized";
    else if (this.state.getValue() === WindowState.MINIMIZED) this.clazz += " window-minimized";

  }


}
