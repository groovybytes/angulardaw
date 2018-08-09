import {ProjectDto} from "../api/ProjectDto";
import {GridDto} from "../api/GridDto";
import {GridCellDto} from "../api/GridCellDto";
import {GridColumnDto} from "../api/GridColumnDto";
import {Inject, Injectable} from "@angular/core";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {Observable} from "rxjs";

@Injectable()
export class ProjectsService {

  constructor(@Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>){

  }
  createProject(name: string): ProjectDto {
    let project = new ProjectDto();
    project.name = name;
    let grid = project.grid = new GridDto();
    grid.nColumns = 10;
    grid.nRows = 30;
    grid.columns = this.createColumnInfos(grid.nColumns);
    grid.cells = this.createPatternCells(grid.nRows, grid.nColumns);
    return project;
  }


  private createPatternCells(rows: number, columns: number): Array<GridCellDto> {
    let model = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        model.push(new GridCellDto(null, j, i, null));
      }
    }

    return model;
  }

  private createColumnInfos(columns: number): Array<GridColumnDto> {
    let result = [];
    for (let i = 0; i < columns; i++) {

      result.push(new GridColumnDto(null, i));
    }

    return result;
  }
}


/*
import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {ProjectMapper} from "../api/mapping/ProjectMapper";
import {TrackMapper} from "../api/mapping/TrackMapper";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {ProjectDto} from "../api/ProjectDto";
import {Track} from "../../model/daw/Track";
import {TransportService} from "./transport.service";
import {System} from "../../system/System";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {NoteTriggerMapper} from "../api/mapping/NoteTriggerMapper";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {GridMapperService} from "../api/mapping/GridMapper.service";
import {Observable} from "rxjs/index";

@Injectable()
export class ProjectsService {

  constructor(
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    private system: System,
    private transportService: TransportService
  ) {

  }


  loadGhostProject(project: ProjectDto): Promise<Project> {
    let result: Project;
    return new Promise<Project>((resolve, reject) => {
      result = ProjectMapper.fromJSON(project);
      resolve(result);
    })

  }

  addPlugin(track: Track, id: PluginId, position: number): Promise<WstPlugin> {

    return new Promise<WstPlugin>((resolve, reject) => {
      try {
        if (track.plugins[0]) track.plugins[0].destroy();
        track.plugins.length = 0;
        this.pluginsService.loadPlugin(id)
          .then(plugin => {
            track.plugins.push(plugin);
            this.updateTrack(track);
            resolve(plugin);
          })
          .catch(error => reject(error));
      }
      catch (e) {
        reject(e);
      }

    })
  }

  removePlugin(track: Track, position: number): void {
    track.plugins[0].destroy();
    track.plugins = null;
    this.updateTrack(track);
  }

  addTrack<T>(project: Project, index: number, ghost?: boolean): Track {
    let track = new Track(project.id, this.transportService.getEvents(), this.transportService.getInfo());
    track.index = index;
    project.tracks.push(track);

    if (!ghost) this.tracksApi.post(TrackMapper.toJSON(track))
      .subscribe(result => {
        track.id = result.id;
        console.log("track saved");
      }, error => this.system.error(error));

    return track;
  }


  private updateTrack(track: Track): void {
    this.tracksApi.put(TrackMapper.toJSON(track)).subscribe(result => {
    }, error => this.system.error(error));
  }

}
*/
