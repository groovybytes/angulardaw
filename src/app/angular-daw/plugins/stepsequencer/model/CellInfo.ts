export class CellInfo{
  row:number;
  column:number;
  beat:number;
  bar:number;
  note:string;
  active:boolean=false;

  getCssClass():string{
    let result = "cell";
    result+=this.row % 2 === 0?" cell-default":" cell-alt";
    result+=this.active?" active":"";
    return result;
  }
}
