import {GridCellDto} from "./GridCellDto";
import {GridColumnDto} from "./GridColumnDto";
import {ContentCell} from "../../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../../ui/flexytable/model/HeaderCell";
import {FlexyGridEntry} from "../../ui/flexytable/model/FlexyGridEntry";
import {TrackDto} from "./TrackDto";

export class GridDto {
  nRows: number=5;
  nColumns: number=10;
  contentCells: Array<Array<ContentCell>> = [];
  headerCells: Array<HeaderCell<TrackDto>> = [];
  entries: Array<FlexyGridEntry<GridCellDto>> = [];
}
