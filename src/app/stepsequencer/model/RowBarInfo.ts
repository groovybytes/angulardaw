import {Lang} from "../../model/utils/Lang";

export class RowBarInfo{
  constructor(row: number, note: string, text: string) {
    this.row = row;
    this.note = note;
    this.text = text;
  }
  row:number;
  note:string;
  text:string;

  getId():string{
    return Lang.guid();
  }
  getCssClass():string{
    let result = "cell";
    result+=this.row % 2 === 0?" cell-default":" cell-alt";
    return result;
  }


}
