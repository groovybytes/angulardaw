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


  onCellDblClicked(cell: GridCellDto, project: ProjectDto,event:EventEmitter<Pattern>): void {
    let pattern:Pattern;
    if (cell.patternId) {
      pattern = project.patterns.find(p => p.id === cell.patternId);
      cell.patternId = null;
      pattern.isBeingEdited = false;
    }
    else {
      pattern = new Pattern();
      pattern.id = this.projectsService.guid();
      project.patterns.forEach(p => p.isBeingEdited = false);
      project.patterns.push(pattern);
      cell.patternId = pattern.id;
      pattern.isBeingEdited = true;

    }

    event.emit(pattern);
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
  /*  */
}
