import {NoteTrigger} from "./NoteTrigger";


export class Pattern{
  id:string;
  length:number=8; //beats
  events: Array<NoteTrigger> = [];
  notes:Array<string>=[];
  isBeingEdited:boolean=false;
  enabled:boolean=false;
  //transportParams:TransportParams;
}
