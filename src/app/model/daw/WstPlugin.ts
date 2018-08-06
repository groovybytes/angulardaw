import {PerformanceEvent} from "./events/PerformanceEvent";
import {PluginId} from "./plugins/PluginId";
import {TransportPosition} from "./TransportPosition";

//web studio technology plugin :)
export interface WstPlugin {
  getId(): PluginId;
  feed(event:PerformanceEvent<any>,position:TransportPosition): any;
  destroy():void;
  load():Promise<WstPlugin>;
}
