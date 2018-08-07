import {NoteTriggerDto} from "../../shared/api/NoteTriggerDto";

export class EventCell {
  constructor(note: NoteTriggerDto, x: number, y: number, column: number, row: number) {
    this.note = note;
    this.x = x;
    this.y = y;
    this.column = column;
    this.row = row;
  }



  note: NoteTriggerDto;
  x: number;
  y: number;
  column: number;
  row:number;

}
