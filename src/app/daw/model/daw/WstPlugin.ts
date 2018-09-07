import {NoteTrigger} from "./NoteTrigger";
import {PluginInfo} from "./plugins/PluginInfo";


//web studio technology plugin :)
export interface WstPlugin {
  getId(): string;
  getInfo():PluginInfo;
  feed(event:NoteTrigger, offset:number, destinationNode?:AudioNode): any;
  destroy():void;
  load():Promise<WstPlugin>;
  getNotes():Array<string>;
}
