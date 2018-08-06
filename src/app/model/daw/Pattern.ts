
import {TransportParams} from "./TransportParams";
import {NoteTriggerDto} from "../../shared/api/NoteTriggerDto";

export class Pattern{
  length:number; //beats
  events: Array<NoteTriggerDto> = [];
  notes:Array<string>;
  transportParams:TransportParams;
}
