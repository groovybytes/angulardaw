import {KeyBindings} from "./KeyBindings";

export class PushSettings {
  baseNote: string;
  scale: string;
  keyBindings:KeyBindings;
  //size:number;
  columns:number;
  rows:number;
  showKeyBindings:boolean=false;
}
