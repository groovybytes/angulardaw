export class GridColumnDto{
  trackId: any;
  gridIndex: number

  constructor(trackId: any, gridIndex: number) {
    this.trackId = trackId;
    this.gridIndex = gridIndex;
  }
}