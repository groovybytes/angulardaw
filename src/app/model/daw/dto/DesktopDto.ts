import {WindowDto} from "./WindowDto";
import {Layout} from "../visual/desktop/Layout";

export class DesktopDto{
  layout:Layout;
  windows:Array<WindowDto>=[];
}
