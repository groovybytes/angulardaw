import {Pad} from "../pad/Pad";

export class PluginDto {
  id:string;
  instanceId:string;
  pluginTypeId: string;
  inputNode:string;
  outputNode:string;
  pad:Pad;
}
