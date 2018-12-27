import {Pattern} from "../Pattern";
import {Lang} from "../../utils/Lang";

export class Cell<T>{
  constructor( row: number, column: number) {
    this.id = Lang.guid();
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
