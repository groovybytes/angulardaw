import {Track} from './Track';
import {TimeSignature} from '../mip/TimeSignature';
import {TransportParams} from "./TransportParams";
import {ProjectEntity} from "../../../../../audiotools-server/src/projects/project.entity";
import {TrackEntity} from "../../../../../audiotools-server/src/projects/track.entity";

export class Project {
  transportParams:TransportParams=new TransportParams();
  id: any;
  userId:string;
  name: string;
  tracks: Array<Track> = [];

  constructor() {

  }

  newTrack():Track{
    let track = new Track();
    this.tracks.push(track);

    return track;
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }

  static toJSON(project: Project): ProjectEntity {
    let entity = new ProjectEntity();
    entity.userId = project.userId;
    entity.bpm = project.transportParams.bpm;
    entity.name = project.name;
    entity.quantization = project.transportParams.quantization;
    entity.signature = [project.transportParams.signature.beatUnit, project.transportParams.signature.barUnit];
    entity.tracks = [];
    project.tracks.forEach((track, i) => {
      let trackEntity = new TrackEntity();
      trackEntity.index = i;
      trackEntity.name = "";
      trackEntity.events = track.queue;
      entity.tracks.push(trackEntity);
    });

    return entity;
  }

  static fromJSON(projectEntity: ProjectEntity): Project {
    let project = new Project();
    let transportParams = project.transportParams = new TransportParams();
    transportParams.bpm = projectEntity.bpm;
    transportParams.signature = new TimeSignature(projectEntity.signature[0], projectEntity.signature[1]);
    transportParams.quantization = projectEntity.quantization;
    project.name = projectEntity.name;
    project.id = projectEntity.id;
    project.tracks.length = 0;
    project.userId=projectEntity.userId;
    if (projectEntity.tracks) projectEntity.tracks.forEach(track => {
      let newTrack = new Track();
      newTrack.id = track.id;
      newTrack.name = track.name;
      newTrack.index = track.index;
      newTrack.queue = track.events;
      project.tracks.push(newTrack);
    });

    return project;


  }

}
