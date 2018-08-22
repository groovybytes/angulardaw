import {NoteTrigger} from "./NoteTrigger";


export class Pattern{
  constructor(notes:Array<string>){
    this.notes=notes;
  }
  id:string;
  length:number=8; //beats
  events: Array<NoteTrigger> = [];
  notes:Array<string>=[];
  isBeingEdited:boolean=false;
  enabled:boolean=false;
  //transportParams:TransportParams;
}
