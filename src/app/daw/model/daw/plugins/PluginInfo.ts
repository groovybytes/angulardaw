import {Pad} from "../pad/Pad";

export class PluginInfo{
  id:string;
  name:string;
  noteRange:{start:string,end:string};
  folder:string;
  useInDefaultProjectTemplate:boolean;
  pad:Pad;
}
