export class SequencerDimensions{
  headerBarHeight:number;
  rowBarWidth:number;
  cellPadding:number;
  padding:number;
  cellWidth:number;
  cellHeight:number;
  columns:number;
  rows:number;
  top:number;
  left:number;
  bodyHeight:number;
  bodyWidth:number;



  getBandWidthX():number{
    return this.cellWidth+this.padding*2;
  }
  getBandWidthY():number{
    return this.cellHeight+this.padding*2;
  }

  getRangeX():number{
    return this.getBandWidthX()*this.columns;
  }
  getRangeY():number{
    return this.getBandWidthY()*this.rows;
  }

}
