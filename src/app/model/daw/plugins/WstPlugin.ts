import {NoteTrigger} from "../NoteTrigger";
import {Plugin} from "./Plugin";

//web studio technology plugin :)
export interface WstPlugin extends Plugin {

  feed(event:NoteTrigger, offset:number): any;
  getNotes():Array<string>;
  destroy(): void;

}
