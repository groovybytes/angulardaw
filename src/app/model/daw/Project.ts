import {Track} from './Track';
import {TimeSignature} from '../mip/TimeSignature';
import {TransportParams} from "./TransportParams";
import {ProjectEntity} from "../../../../../audiotools-server/src/projects/project.entity";
import {TrackEntity} from "../../../../../audiotools-server/src/projects/track.entity";
import {Transport} from "./Transport";
import {TrackCategory} from "./TrackCategory";
import {MidiTrack} from "./MidiTrack";
import {ClickTrack} from "./ClickTrack";

export class Project {
  transportParams: TransportParams = new TransportParams();
  id: any;
  userId: string;
  name: string;
  private tracks: Array<Track> = [];
  transport: Transport;

  constructor() {

  }

  newTrack(category: TrackCategory): Track {
    let track: Track;
    if (category === TrackCategory.MIDI) track = new MidiTrack();
    else if (category === TrackCategory.CLICK) track = new ClickTrack();
    else throw "category not found";
    track.setTransport(this.transport);
    this.tracks.push(track);

    return track;
  }

  registerTrack(track: Track): void {
    track.setTransport(this.transport);
    this.tracks.push(track);
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
      trackEntity.events = track instanceof MidiTrack?track.queue:[];
      trackEntity.category = track.category;
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
    project.userId = projectEntity.userId;
    if (projectEntity.tracks) projectEntity.tracks.forEach(track => {
      let newTrack = project.newTrack(track.category);
      newTrack.id = track.id;
      newTrack.name = track.name;
      newTrack.index = track.index;
      if (newTrack instanceof MidiTrack) newTrack.queue = track.events;
      newTrack.category = track.category;
    });

    return project;


  }

}


