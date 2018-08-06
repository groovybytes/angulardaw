import {Pattern} from "../../model/daw/Pattern";

export class PatternCell{
  constructor(column: number, row: number, pattern: Pattern) {
    this.column = column;
    this.row = row;
    this.pattern = pattern;
  }
  column:number;
  row:number;
  pattern:Pattern;
}
