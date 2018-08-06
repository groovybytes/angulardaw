import {TransportPosition} from "../../model/daw/TransportPosition";

export class NoteCell {
  constructor(position: TransportPosition, note: string,row:number) {
    this.position = position;
    this.note = note;
    this.row=row;
  }

  position: TransportPosition;
  note: string;
  row: number;
}
