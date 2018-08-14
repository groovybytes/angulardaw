import {Injectable} from "@angular/core";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {GridViewModel} from "../model/viewmodel/GridViewModel";
import {GridCellViewModel} from "../model/viewmodel/GridCellViewModel";
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";
import {PluginId} from "../model/daw/plugins/PluginId";
import {HeaderCell} from "../ui/flexytable/model/HeaderCell";
import {ProjectViewModel} from "../model/viewmodel/ProjectViewModel";
import {WstPlugin} from "../model/daw/WstPlugin";

@Injectable()
export class DawGridService {

  constructor() {

  }

  createHeaderCells(nColumns: number): Array<HeaderCell<TrackViewModel>> {

    let cells: Array<HeaderCell<TrackViewModel>> = [];
    for (let i = 0; i < nColumns; i++) {
      let cell = new HeaderCell<TrackViewModel>();
      cell.column = i;
      cells.push(cell);
    }

    return cells;

  }

  createContentCells(nRows: number, nColumns: number): Array<Array<ContentCell>> {

    let model = [];

    for (let i = 0; i < nRows; i++) {
      let row = [];
      model.push(row);
      for (let j = 0; j < nColumns; j++) {

        let cell = new ContentCell(i, j);
        row.push(cell);
      }
    }

    return model;

  }

  updateEntryPositions(grid: GridViewModel, cellWidth: number, cellHeight: number): void {
    grid.entries.filter(entry => entry.data).forEach(entry => {
      entry.left = entry.data.column * cellWidth;
      entry.top = entry.data.row * cellHeight;
    });
  }

  addEvent(entry: FlexyGridEntry<GridCellViewModel>, cellWidth: number, cellHeight: number, patterns: Array<PatternViewModel>): PatternViewModel {

    let pattern = new PatternViewModel();
    pattern.id = this.guid();
    patterns.forEach(p => p.isBeingEdited = false);
    patterns.push(pattern);
    let row = entry.top / cellHeight;
    let column = entry.left / cellWidth;
    entry.data = new GridCellViewModel(null, row, column, pattern.id);

    return pattern;
  }

  removeEvent(entry: FlexyGridEntry<GridCellViewModel>, patterns: Array<PatternViewModel>): void {
    let index = patterns.findIndex(p => p.id === entry.data.patternId);
    patterns.splice(index, 1)
    /* let entryIndex = grid.entries.findIndex(d=>d.data&& d.data.patternId===patterns[index].id);
    /!* grid.entries.splice
     patterns.splice(index,1);*!/*/
  }

  updateEvent(entry: FlexyGridEntry<GridCellViewModel>, cellWidth: number, cellHeight: number): void {
    entry.data.row = entry.top / cellHeight;
    entry.data.column = entry.left / cellWidth;
  }

  //returns true when a new track has been created
  setPlugin(plugin: PluginId, cell: HeaderCell<TrackViewModel>, projectViewModel: ProjectViewModel): boolean {
    let newTrack: boolean = false;
    let track: TrackViewModel = cell.data;
    if (!track) {
      cell.data = track = new TrackViewModel(this.guid());
      track.projectId = projectViewModel.id;
      projectViewModel.tracks.push(track);
      newTrack = true;
    }
    track.pluginId = plugin;

    return newTrack;
  }

  removeTrack(cell: HeaderCell<TrackViewModel>, projectViewModel: ProjectViewModel): void {
    let index = projectViewModel.tracks.findIndex(t => t.id === cell.data.id);
    projectViewModel.tracks.splice(index, 1);

  }


  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


}
