import {PluginId} from "./plugins/PluginId";
import {NoteTrigger} from "./NoteTrigger";
import {PluginInfo} from "./plugins/PluginInfo";


//web studio technology plugin :)
export interface WstPlugin {
  getId(): PluginId;
  feed(event:NoteTrigger, offset:number, destinationNode?:AudioNode): any;
  destroy():void;
  load():Promise<WstPlugin>;
  getNotes():Array<string>;
}
