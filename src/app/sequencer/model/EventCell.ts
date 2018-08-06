import {TransportPosition} from "../../model/daw/TransportPosition";

export class EventCell {

  position: TransportPosition;
  note: string;
  x:number;
  y:number;

  constructor(position: TransportPosition, note: string, x: number, y: number) {
    this.position = position;
    this.note = note;
    this.x = x;
    this.y = y;
  }
}
