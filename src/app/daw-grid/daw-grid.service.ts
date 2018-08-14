import {Injectable} from "@angular/core";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {GridDto} from "../shared/api/GridDto";
import {GridCellDto} from "../shared/api/GridCellDto";
import {Pattern} from "../model/daw/Pattern";
import {ProjectsService} from "../shared/services/projects.service";
import {TrackDto} from "../shared/api/TrackDto";
import {PluginId} from "../model/daw/plugins/PluginId";
import {HeaderCell} from "../ui/flexytable/model/HeaderCell";
import {ProjectDto} from "../shared/api/ProjectDto";
import {PluginsService} from "../shared/services/plugins.service";

@Injectable()
export class DawGridService {

  constructor(private projectsService: ProjectsService,private pluginsService:PluginsService) {

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

  updateEntryPositions(grid: GridDto, cellWidth: number, cellHeight: number): void {
    grid.entries.filter(entry=>entry.data).forEach(entry => {
      entry.left = entry.data.column * cellWidth;
      entry.top = entry.data.row * cellHeight;
    });
  }

  addEvent(entry: FlexyGridEntry<GridCellDto>, cellWidth: number, cellHeight: number, patterns: Array<Pattern>): Pattern {

    let pattern = new Pattern();
    pattern.id = this.projectsService.guid();
    patterns.forEach(p => p.isBeingEdited = false);
    patterns.push(pattern);
    let row = entry.top / cellHeight;
    let column = entry.left / cellWidth;
    entry.data = new GridCellDto(null, row, column, pattern.id);

    return pattern;
  }

  removeEvent(entry: FlexyGridEntry<GridCellDto>,patterns:Array<Pattern>): void {
    let index = patterns.findIndex(p=>p.id===entry.data.patternId);
    patterns.splice(index,1)
   /* let entryIndex = grid.entries.findIndex(d=>d.data&& d.data.patternId===patterns[index].id);
   /!* grid.entries.splice
    patterns.splice(index,1);*!/*/
  }

  updateEvent(entry: FlexyGridEntry<GridCellDto>,cellWidth: number, cellHeight: number): void {
    entry.data.row = entry.top / cellHeight;
    entry.data.column = entry.left / cellWidth;
  }

 /* setPlugin(plugin: string, cell: HeaderCell<TrackDto>,project:ProjectDto): Promise<void> {
    return new Promise((resolve,reject)=>{
      let track:TrackDto=cell.data;
      if (!track) {
        cell.data = track=new TrackDto();
        track.projectId=project.id;
        project.tracks.push(track);
      }

      this.pluginsService.loadPlugin(plugin).then()
    })
  }*/

 /* private _selectInstrument(track:TrackDto): Promise<void> {
    return new Promise((resolve, reject) => {
      if (instr === "") {
        if (track.pluginId) column.instrument.destroy();
        this.projectsService.removePlugin(column.track,0);
        column.instrument=null;
        resolve();
      }
      else this.projectsService.addPlugin(column.track, PluginId[instr.toUpperCase()],0)
        .then(instrument => {
          column.instrument=instrument;
          resolve();
        })
        .catch(error => reject(error))
    })
  }*/





}
