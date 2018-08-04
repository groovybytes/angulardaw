import {Inject, Injectable} from "@angular/core";
import {Project} from "../model/daw/Project";
import {ProjectMapper} from "../shared/api/mapping/ProjectMapper";
import {TrackMapper} from "../shared/api/mapping/TrackMapper";
import {MidiTrack} from "../model/daw/MidiTrack";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectDto} from "../shared/api/ProjectDto";
import {TrackDto} from "../shared/api/TrackDto";
import {EventDto} from "../shared/api/EventDto";
import {Transport} from "../model/daw/Transport";

@Injectable()
export class MainPageService{

  constructor(
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    @Inject("TracksApi") private tracksApi: ApiEndpoint<TrackDto>,
    @Inject("EventsApi") private eventsApi: ApiEndpoint<EventDto>,
  ){

  }
  loadProject(id:any,transport:Transport):Promise<Project>{
    let result:Project;
    return new Promise<Project>((resolve,reject)=>{

      this.projectsApi.get(id).subscribe(project => {
        result = ProjectMapper.fromJSON(project);
        result.transport=transport;
        result.transportParams=transport.params;
        this.tracksApi.find({projectId: id}).subscribe(tracks => {
            tracks.forEach(t => {
              let newTrack = TrackMapper.fromJSON(t);
              result.registerTrack(newTrack);
              if (newTrack instanceof MidiTrack) {
                this.eventsApi.find({trackId: t.id}).subscribe(events => {
                  (<MidiTrack>newTrack).queue = events;
                },error=>reject(error));
              }
            });

            resolve(result);

          },error=>reject(error));

      }, error => reject(error))
    })

  }
}
