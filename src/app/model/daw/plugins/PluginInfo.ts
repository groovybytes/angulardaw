import {Pad} from "../pad/Pad";
import {PluginId} from "./PluginId";

export class PluginInfo{
  id:string;
  name:string;
  category:string;
  pad:Pad;
  noteRange:{start:string,end:string};
  folder:string;
  useInDefaultProjectTemplate:boolean;
}
