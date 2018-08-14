export class GridCellViewModel{
  trackId: any;
  row: number;
  column:number;
  patternId: any;

  constructor(trackId: any, row: number, column: number, patternId: any) {
    this.trackId = trackId;
    this.row = row;
    this.column = column;
    this.patternId = patternId;
  }
}
