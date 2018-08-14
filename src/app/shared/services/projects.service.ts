import {ProjectDto} from "../api/ProjectDto";
import {GridDto} from "../api/GridDto";
import {GridCellDto} from "../api/GridCellDto";
import {GridColumnDto} from "../api/GridColumnDto";
import {Inject, Injectable} from "@angular/core";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {Observable} from "rxjs";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {Track} from "../../model/daw/Track";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {PluginsService} from "./plugins.service";
import {Project} from "../../model/daw/Project";
import {TrackDto} from "../api/TrackDto";
import {TransportService} from "./transport.service";

@Injectable()
export class ProjectsService {

  constructor(
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    private transportService:TransportService,
    private pluginsService: PluginsService) {

  }

  createProject(name: string): ProjectDto {
    let project = new ProjectDto();
    project.id = this.guid();
    project.name = name;
    let grid = project.grid = new GridDto();
    grid.nColumns = 5;
    grid.nRows = 5;
    return project;
  }

  addPlugin(track: Track, id: PluginId): Promise<WstPlugin> {
    return new Promise<WstPlugin>((resolve, reject) => {
      try {
        if (track.plugin) track.plugin.destroy();
        track.plugin = null;
        this.pluginsService.loadPlugin(id)
          .then(plugin => {
            track.plugin=plugin;
            resolve(plugin);
          })
          .catch(error => reject(error));
      }
      catch (e) {
        reject(e);
      }

    })
  }

  removePlugin(track: Track): void {
    track.plugin.destroy();
    track.plugin = null;
  }

  addTrack<T>(project: Project, trackDto:TrackDto): Track {
    let track = new Track(trackDto, this.transportService.getEvents(), this.transportService.getInfo());
    project.tracks.push(track);
    return track;
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
