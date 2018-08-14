import {NoteTriggerViewModel} from "./NoteTriggerViewModel";

export class PatternViewModel{
  id:string;
  length:number=8; //beats
  events: Array<NoteTriggerViewModel> = [];
  notes:Array<string>=[];
  isBeingEdited:boolean=false;
  //transportParams:TransportParams;
}
