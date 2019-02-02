import {Cell} from "../matrix/Cell";

export class MatrixDto{
  body:Array<Array<Cell<string>> >=[];
  header:Array<Cell<string> >=[];
  rowHeader:Array<Cell<string> >=[];
}
