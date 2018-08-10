import {EventEmitter, Inject, Injectable} from "@angular/core";
import {Project} from "../model/daw/Project";
import {System} from "../system/System";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {TrackDto} from "../shared/api/TrackDto";
import {PluginsService} from "../shared/services/plugins.service";
import {PatternsService} from "../shared/services/patterns.service";
import {GridDto} from "../shared/api/GridDto";
import {GridCellDto} from "../shared/api/GridCellDto";
import {Pattern} from "../model/daw/Pattern";
import {ProjectDto} from "../shared/api/ProjectDto";
import {ProjectsService} from "../shared/services/projects.service";

@Injectable()
export class GridComponentService {

  constructor(
    private pluginsService: PluginsService,
    private patternService: PatternsService,
    private projectsService: ProjectsService,
    @Inject("TracksApi") private tracks: ApiEndpoint<TrackDto>,
    @Inject("GridApi") private grid: ApiEndpoint<GridDto>,
    private system: System) {


  }


  onCellDblClicked(cell: GridCellDto, project: ProjectDto): void {
    if (cell.patternId) {
      let pattern = project.patterns.find(p => p.id === cell.patternId);
      cell.patternId = null;
      pattern.isBeingEdited = false;
    }
    else {
      let pattern = new Pattern();
      pattern.id = this.projectsService.guid();
      project.patterns.forEach(p => p.isBeingEdited = false);
      project.patterns.push(pattern);
      cell.patternId = pattern.id;
      pattern.isBeingEdited = true;

    }
  }

  onCellClicked(cell: GridCellDto, project: ProjectDto): void {
    project.patterns.forEach(p => p.isBeingEdited = false);
    if (cell.patternId) {
      let pattern = project.patterns.find(p => p.id === cell.patternId);
      pattern.isBeingEdited = true;
    }
  }

  /*onCellClicked(project:Project,cell: PatternCell,emitter): void{
   /!* if (!cell.pattern) this.patternService.create(project)
      .then(pattern => {
        cell.pattern = pattern;
        emitter.emit(cell.pattern);

      })
      .catch(error => {
        this.system.error(error)
      });
    else emitter.emit(cell.pattern);*!/
  }*/
  /*  selectInstrument(instr: string, column: ColumnInfo,project:Project): Promise<void> {
      if (!column.track) {
        column.track = this.projectsService.addTrack(project,column.column);
      }
      return this._selectInstrument(instr,column);


    }

    private _selectInstrument(instr: string, column: ColumnInfo): Promise<void> {
     return new Promise((resolve, reject) => {
        if (instr === "") {
          if (column.instrument) column.instrument.destroy();
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
