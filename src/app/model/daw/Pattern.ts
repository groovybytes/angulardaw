
import {TransportParams} from "./TransportParams";
import {NoteTriggerDto} from "../../shared/api/NoteTriggerDto";

export class Pattern{
  id:string;
  length:number=8; //beats
  events: Array<NoteTriggerDto> = [];
  notes:Array<string>=[];
  isBeingEdited:boolean=false;
  //transportParams:TransportParams;
}
