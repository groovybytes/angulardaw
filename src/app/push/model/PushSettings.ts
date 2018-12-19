import {KeyBindings} from "./KeyBindings";
import {ScaleId} from "../../model/mip/scales/ScaleId";

export class PushSettings {
  baseNote: string;
  scale: ScaleId;
  keyBindings:KeyBindings;
  columns:number;
  rows:number;
  showKeyBindings:boolean=false;
}
