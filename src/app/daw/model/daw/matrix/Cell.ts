import * as _ from "lodash";
import {Pattern} from "../Pattern";

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
  animation:string;
  patternMenu:Pattern; //show pattern menu if pattern above
  menuOpen:boolean=false;

}
