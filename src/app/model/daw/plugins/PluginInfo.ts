import {Pad} from "../pad/Pad";

export class PluginInfo{
  id:string;
  name:string;
  category:string;
  pad:Pad;
  noteRange:{start:string,end:string};
  folder:string;
  useInDefaultProjectTemplate:boolean;
}
