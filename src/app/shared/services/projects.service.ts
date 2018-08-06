import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {ProjectMapper} from "../api/mapping/ProjectMapper";
import {TrackMapper} from "../api/mapping/TrackMapper";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {ProjectDto} from "../api/ProjectDto";
import {TrackDto} from "../api/TrackDto";
import {Drums} from "../../model/daw/plugins/Drums";
import {InstrumentMapping} from "../../model/mip/instruments/drums/spec/InstrumentMapping";
import {Sample} from "../../model/daw/Sample";
import {FilesApi} from "../../api/files.api";
import {AppConfiguration} from "../../app.configuration";
import {SamplesApi} from "../../api/samples.api";
import {Track} from "../../model/daw/Track";
import {TransportService} from "./transport.service";
import {System} from "../../system/System";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {NoteTriggerDto} from "../api/NoteTriggerDto";
import {NoteTriggerMapper} from "../api/mapping/NoteTriggerMapper";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {Metronome} from "../../model/daw/plugins/Metronome";
import {PluginsService} from "./plugins.service";
import {Pattern} from "../../model/daw/Pattern";
import * as _ from "lodash";

@Injectable()
export class ProjectsService {

  constructor(
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    @Inject("TracksApi") private tracksApi: ApiEndpoint<TrackDto>,
    @Inject("EventsApi") private eventsApi: ApiEndpoint<NoteTriggerDto>,
    private pluginsService:PluginsService,
    private system: System,
    private transportService: TransportService
  ) {

  }

  loadProject(id: any): Promise<Project> {
    let result: Project;
    return new Promise<Project>((resolve, reject) => {
      try {
        this.projectsApi.get(id).subscribe(project => {
          result = ProjectMapper.fromJSON(project);
          result.transportParams = this.transportService.params;

          this.tracksApi.find({projectId: id}).subscribe(tracks => {
            let promises = [];
            tracks.forEach(t => {
              let newTrack = TrackMapper.fromJSON(t, this.transportService.getEvents(), this.transportService.getInfo());
              result.tracks.push(newTrack);
              if (t.pluginId)
                promises.push(this.addPlugin(newTrack, PluginId[t.pluginId.toUpperCase()],0));
              let promise = new Promise((resolve, reject) => {
                this.eventsApi.find({trackId: t.id}).subscribe(events => {
                  resolve(events);
                }, error => reject(error));
              });
              promises.push(promise);
              promise.then((result: Array<NoteTriggerDto>) => {
                result.forEach(trigger=>newTrack.addEvent(NoteTriggerMapper.fromJSON(trigger)));
              })

            });

            Promise.all(promises)
              .then(() => resolve(result))
              .catch(error => this.system.error(error));

          }, error => reject(error));

        }, error => reject(error))
      }
      catch (e) {
        reject(e);
      }

    })

  }

  loadGhostProject(project: ProjectDto): Promise<Project> {
    let result: Project;
    return new Promise<Project>((resolve, reject) => {
      result = ProjectMapper.fromJSON(project);
      resolve(result);
    })

  }

  addPlugin(track: Track, id: PluginId,position:number): Promise<WstPlugin> {

    return new Promise<WstPlugin>((resolve, reject) => {
      try {
        if (track.plugins[0]) track.plugins[0].destroy();
        track.plugins.length=0;
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

  removePlugin(track: Track,position:number): void {
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
