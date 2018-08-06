import {TransportPosition} from "../../model/daw/TransportPosition";

export class ColumnInfo{
  constructor(column: number, position: TransportPosition) {
    this.column = column;
    this.position = position;
  }


  column:number;
  position:TransportPosition

}
