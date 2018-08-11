import {TransportPosition} from "../../model/daw/TransportPosition";
import {NoteTriggerDto} from "../../shared/api/NoteTriggerDto";

export class Cell {
  constructor(events: Array<NoteTriggerDto>, position: TransportPosition, note: string, row: number, column: number) {
    this.events = events;
    this.position = position;
    this.note = note;
    this.row = row;
    this.column = column;
  }


  events:Array<NoteTriggerDto>;
  position: TransportPosition;
  note: string;
  row: number;
  column:number;
}
