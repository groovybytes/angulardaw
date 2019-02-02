import {Cell} from "./Cell";
import {Pattern} from "../Pattern";
import {Track} from "../Track";


export class Matrix{
  body:Array<Array<Cell<Pattern>> >=[];
  header:Array<Cell<Track> >=[];
  rowHeader:Array<Cell<string> >=[];
}
