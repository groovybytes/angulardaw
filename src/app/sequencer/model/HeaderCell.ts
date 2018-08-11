import {TransportPosition} from "../../model/daw/TransportPosition";

export class HeaderCell{
  constructor(column: number, position: TransportPosition) {
    this.column = column;
    this.position = position;
  }


  column:number;
  position:TransportPosition

}
