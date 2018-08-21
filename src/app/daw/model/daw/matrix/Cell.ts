import * as _ from "lodash";

export class Cell<T>{
  constructor( row: number, column: number) {
    this.id = _.uniqueId("cell_");
    this.row = row;
    this.column = column;
  }
  id:string;
  trackId:string;
  row:number;
  column:number;
  data:T;

}
