import {GridCellViewModel} from "./GridCellViewModel";
import {GridColumnViewModel} from "./GridColumnViewModel";
import {ContentCell} from "../../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../../ui/flexytable/model/HeaderCell";
import {FlexyGridEntry} from "../../ui/flexytable/model/FlexyGridEntry";
import {TrackViewModel} from "./TrackViewModel";

export class GridViewModel {
  nRows: number=5;
  nColumns: number=10;
  contentCells: Array<Array<ContentCell>> = [];
  headerCells: Array<HeaderCell<TrackViewModel>> = [];
  entries: Array<FlexyGridEntry<GridCellViewModel>> = [];
}
