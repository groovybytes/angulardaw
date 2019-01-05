import {KeyBindings} from "./KeyBindings";
import {ScaleId} from "../../model/mip/scales/ScaleId";

export class PushSettings {


  constructor(id: string, title: string,hint:string) {
    this.id = id;
    this.title = title;
    this.hint = hint;
  }

  baseNote: string;
  scale: ScaleId;
  keyBindings:KeyBindings;
  noteMappings:Array<{note:string,label:string,url:string}>=[];
  columns:number;
  rows:number;
  showKeyBindings:boolean=false;
  id:string;
  hint:string;
  title:string;
}
