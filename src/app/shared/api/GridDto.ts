import {GridCellDto} from "./GridCellDto";
import {GridColumnDto} from "./GridColumnDto";

export class GridDto {
  nRows: number=10;
  nColumns: number=10;
  projectId: number;
  columns: Array<GridColumnDto> = [];
  cells: Array<GridCellDto> = [];
}
