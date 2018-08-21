import {Cell} from "./Cell";


export class Matrix{
  body:Array<Array<Cell<any>> >=[];
  header:Array<Cell<any> >=[];
  rowHeader:Array<Cell<any> >=[];
}
