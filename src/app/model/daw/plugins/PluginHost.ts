import {PluginInfo} from "./PluginInfo";

export interface PluginHost {

  getInfo(): PluginInfo;
  getInstanceId():string;
}
