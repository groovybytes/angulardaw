import {PluginId} from "./plugins/PluginId";
import {TransportPosition} from "./TransportPosition";
import {NoteTriggerViewModel} from "../viewmodel/NoteTriggerViewModel";

//web studio technology plugin :)
export interface WstPlugin {
  getId(): PluginId;
  feed(event:NoteTriggerViewModel,offset:number,destinationNode?:AudioNode): any;
  destroy():void;
  load():Promise<WstPlugin>;
  getNotes():Array<string>;
}
