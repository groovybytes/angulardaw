import {Injectable} from "@angular/core";

@Injectable()
export class DawMatrixService {

  constructor() {

  }

/*//returns true when a new track has been created
  setPlugin(plugin: PluginId, cell: MatrixCell, projectViewModel: ProjectViewModel): boolean {
    let newTrack: boolean = false;
    let track: TrackViewModel = cell.track;
    if (!track) {
      cell.track = track = new TrackViewModel(this.guid());
      track.projectId = projectViewModel.id;
      projectViewModel.tracks.push(track);
      newTrack = true;
    }
    track.pluginId = plugin;

    return newTrack;
  }*/



/*  updateEntryPositions(grid: GridViewModel, cellWidth: number, cellHeight: number): void {
    grid.entries.filter(entry => entry.data).forEach(entry => {
      entry.left = entry.data.column * cellWidth;
      entry.top = entry.data.row * cellHeight;
    });
  }



  removeEvent(entry: FlexyGridEntry<GridCellViewModel>, patterns: Array<PatternViewModel>): void {
    let index = patterns.findIndex(p => p.id === entry.data.patternId);
    patterns.splice(index, 1)
    /!* let entryIndex = grid.entries.findIndex(d=>d.data&& d.data.patternId===patterns[index].id);
    /!* grid.entries.splice
     patterns.splice(index,1);*!/!*!/
  }

  updateEvent(entry: FlexyGridEntry<GridCellViewModel>, cellWidth: number, cellHeight: number): void {
    entry.data.row = entry.top / cellHeight;
    entry.data.column = entry.left / cellWidth;
  }


  removeTrack(cell: HeaderCell<TrackViewModel>, projectViewModel: ProjectViewModel): void {
    let index = projectViewModel.tracks.findIndex(t => t.id === cell.data.id);
    projectViewModel.tracks.splice(index, 1);

  }

  changePattern(project: ProjectViewModel, entry: FlexyGridEntry<GridCellViewModel>,
                emitter: EventEmitter<{ pattern: PatternViewModel, trackId: string }>): void {

    if (entry){
      let pattern = project.patterns.find(p => p.id === entry.data.patternId);
      let headerCell = project.grid.headerCells.find(c => c.column === entry.data.column);
      emitter.emit({pattern: pattern, trackId: headerCell.data?headerCell.data.id:null});
    }
    else emitter.emit({pattern: null, trackId: null});

  }*/


  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


}
