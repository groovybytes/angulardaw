import {EventEmitter, Inject, Injectable} from "@angular/core";
import {Project} from "../model/daw/Project";
import {System} from "../system/System";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";
import {PluginsService} from "../shared/services/plugins.service";
import {PatternsService} from "../shared/services/patterns.service";
import {GridViewModel} from "../model/viewmodel/GridViewModel";
import {GridCellViewModel} from "../model/viewmodel/GridCellViewModel";
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
import {ProjectViewModel} from "../model/viewmodel/ProjectViewModel";
import {ProjectsService} from "../shared/services/projects.service";

@Injectable()
export class GridComponentService {

  constructor(
    private pluginsService: PluginsService,
    private patternService: PatternsService,
    private projectsService: ProjectsService,
    @Inject("TracksApi") private tracks: ApiEndpoint<TrackViewModel>,
    @Inject("GridApi") private grid: ApiEndpoint<GridViewModel>,
    private system: System) {


  }


  onCellDblClicked(cell: GridCellViewModel, project: ProjectViewModel, event:EventEmitter<PatternViewModel>): void {
    let pattern:PatternViewModel;
    if (cell.patternId) {
      pattern = project.patterns.find(p => p.id === cell.patternId);
      cell.patternId = null;
      pattern.isBeingEdited = false;
    }
    else {
      pattern = new PatternViewModel();
      pattern.id = this.projectsService.guid();
      project.patterns.forEach(p => p.isBeingEdited = false);
      project.patterns.push(pattern);
      cell.patternId = pattern.id;
      pattern.isBeingEdited = true;

    }

    event.emit(pattern);
  }

  onCellClicked(cell: GridCellViewModel, project: ProjectViewModel): void {
    project.patterns.forEach(p => p.isBeingEdited = false);
    if (cell.patternId) {
      let pattern = project.patterns.find(p => p.id === cell.patternId);
      pattern.isBeingEdited = true;
    }
  }

  /*onCellClicked(projectViewModel:Project,cell: PatternCell,emitter): void{
   /!* if (!cell.pattern) this.patternService.create(projectViewModel)
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
