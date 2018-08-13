import {GridCellDto} from "./GridCellDto";
import {GridColumnDto} from "./GridColumnDto";
import {ContentCell} from "../../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../../ui/flexytable/model/HeaderCell";
import {FlexyGridEntry} from "../../ui/flexytable/model/FlexyGridEntry";

export class GridDto {
  nRows: number=10;
  nColumns: number=10;
  contentCells: Array<Array<ContentCell>> = [];
  headerCells: Array<HeaderCell> = [];
  entries: Array<FlexyGridEntry<GridCellDto>> = [];
}
