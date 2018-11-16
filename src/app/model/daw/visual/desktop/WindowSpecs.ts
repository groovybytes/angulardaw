import {WindowState} from "./WindowState";
import {WindowPosition} from "./WindowPosition";
import {BehaviorSubject} from "rxjs";

export class WindowSpecs {

  constructor(id: string, state: WindowState, position: WindowPosition) {
    this.id = id;
    this.state.next(state);
    this.position.next(position);
  }

  clazz:string;
  id: string;
  x: number = 200;
  y: number = 50;
  width: number = 800;
  height: number = 600;
  zIndex:number=1;
  zIndexTmp:number=1;
  state: BehaviorSubject<WindowState> = new BehaviorSubject(WindowState.NORMAL);
  position: BehaviorSubject<WindowPosition> = new BehaviorSubject(WindowPosition.LEFT);

}
