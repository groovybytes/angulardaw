import {TransportPosition} from "../../model/daw/TransportPosition";

export class NoteCell {
  constructor(position: TransportPosition, note: string, row: number, column: number) {
    this.position = position;
    this.note = note;
    this.row = row;
    this.column = column;
  }

  position: TransportPosition;
  note: string;
  row: number;
  column:number;
  //active:boolean=false;
}
