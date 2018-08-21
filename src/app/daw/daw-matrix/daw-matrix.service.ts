import {Injectable} from "@angular/core";
import {Matrix} from "../model/daw/matrix/Matrix";
import * as $ from "jquery";
import * as _ from "lodash";
import {Cell} from "../model/daw/matrix/Cell";
import {TracksService} from "../shared/services/tracks.service";
import {Project} from "../model/daw/Project";
import {Track} from "../model/daw/Track";
import {PluginsService} from "../shared/services/plugins.service";
import {System} from "../../system/System";

@Injectable()
export class DawMatrixService {

  constructor(private trackService:TracksService,private pluginService:PluginsService,private system:System) {

  }

  onDrop(event: DragEvent,project:Project,matrix:Matrix): void {
    let data = JSON.parse(event.dataTransfer.getData("text"));
    if (data.command==="plugin"){
      let cell =this.findBodyCell($(event.target).attr("id"),matrix.body);
      this.handlePluginDroppedOnBodyCell(data.id,cell,project)
        .catch(error=>this.system.error(error));
    }
    else{

    }
  }

  private handlePluginDroppedOnBodyCell(pluginId:string,cell:Cell<any>,project:Project):Promise<void>{

    return new Promise((resolve,reject)=>{
      let track:Track;
      if (!cell.trackId){
        track = this.trackService.addTrack(project);
        this.getAllCellsForColumn(project.matrix,cell.column).forEach(_cell=>_cell.trackId=track.id);
      }
      else track = project.tracks.find(t=>t.id===cell.trackId);

      this.pluginService.loadPlugin(pluginId)
        .then(plugin=>{
          track.plugin=plugin;
          track.pluginId=plugin.getId();


          resolve();
        })
        .catch(error=>reject(error));
    })

  }
  private findBodyCell(id:string,cells:Array<Array<Cell<any>>>):Cell<any>{
    return _.flatten(cells).find(cell=>cell.id===id);
  }

  private getAllCellsForColumn(matrix:Matrix,column:number):Array<Cell<any>>{
    return this.getAllCells(matrix).filter(cell=>cell.column===column);
  }

  private getAllCells(matrix:Matrix):Array<Cell<any>>{
    let result:Array<Cell<any>> =   _.flatten(matrix.body);
    matrix.header.forEach(cell=>result.push(cell));
    matrix.rowHeader.forEach(cell=>result.push(cell));

    return result;
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
