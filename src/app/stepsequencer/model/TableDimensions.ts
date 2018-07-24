export class TableDimensions{
  constructor(padding: number, width: number, height: number, nColumns: () => number, nRows: () => number, top: number, left: number) {
    this.padding = padding;
    this.width = width;
    this.height = height;
    this.nColumns = nColumns;
    this.nRows = nRows;
    this.top = top;
    this.left=left;
  }




  padding:number;
  width:number;
  height:number;
  nColumns:()=>number;
  nRows:()=>number;
  top:number;
  left:number;

  getBandWidthX():number{
    return this.width+this.padding*2;
  }
  getBandWidthY():number{
    return this.height+this.padding*2;
  }

  getRangeX():number{
    return this.getBandWidthX()*this.nColumns();
  }
  getRangeY():number{
    return this.getBandWidthY()*this.nRows();
  }

}
