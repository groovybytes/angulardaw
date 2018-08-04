import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {ProjectMapper} from "../api/mapping/ProjectMapper";
import {TrackMapper} from "../api/mapping/TrackMapper";
import {MidiTrack} from "../../model/daw/MidiTrack";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {ProjectDto} from "../api/ProjectDto";
import {TrackDto} from "../api/TrackDto";
import {EventDto} from "../api/EventDto";
import {Instrument} from "../../model/mip/instruments/Instrument";
import {Drums} from "../../model/daw/instruments/Drums";
import {InstrumentMapping} from "../../model/mip/instruments/drums/spec/InstrumentMapping";
import {Sample} from "../../model/daw/Sample";
import {FilesApi} from "../../api/files.api";
import {AppConfiguration} from "../../app.configuration";
import {SamplesApi} from "../../api/samples.api";
import {Track} from "../../model/daw/Track";
import {ClickTrack} from "../../model/daw/ClickTrack";
import {TransportService} from "./transport.service";
import {Clicker} from "../../model/daw/Clicker";
import {Instruments} from "../../model/daw/instruments/Instruments";
import {System} from "../../system/System";

@Injectable()
export class ProjectsService {

  constructor(
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    @Inject("TracksApi") private tracksApi: ApiEndpoint<TrackDto>,
    @Inject("EventsApi") private eventsApi: ApiEndpoint<EventDto>,
    private fileService: FilesApi,
    private system: System,
    private config: AppConfiguration,
    private samplesV2Service: SamplesApi,
    private transportService: TransportService
  ) {

  }

  loadProject(id: any): Promise<Project> {
    let result: Project;
    return new Promise<Project>((resolve, reject) => {
      this.projectsApi.get(id).subscribe(project => {
        result = ProjectMapper.fromJSON(project);
        result.transportParams = this.transportService.params;
        this.tracksApi.find({projectId: id}).subscribe(tracks => {
          let promises = [];
          tracks.forEach(t => {
            let newTrack = TrackMapper.fromJSON(t, this.transportService.getEvents(), this.transportService.getInfo());
            result.tracks.push(newTrack);
            if (t.instrumentId) this.setInstrument(newTrack, Instruments[t.instrumentId])
              .catch(error => this.system.error(error));
            if (newTrack instanceof MidiTrack) {
              this.eventsApi.find({trackId: t.id}).subscribe(events => {
                (<MidiTrack>newTrack).queue = events;
              }, error => reject(error));
            }
          });

          resolve(result);

        }, error => reject(error));

      }, error => reject(error))
    })

  }

  loadGhostProject(project: ProjectDto): Promise<Project> {
    let result: Project;
    return new Promise<Project>((resolve, reject) => {
      result = ProjectMapper.fromJSON(project);
      resolve(result);
    })

  }

  setInstrument(track: Track, id: Instruments): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try{
        if (track.instrument) track.instrument.destroy();
        track.instrument = null;
        this.loadInstrument(id)
          .then(instrument => {
            track.instrument = instrument;
            this.saveTrack(track);
            resolve();
          })
          .catch(error => reject(error));
      }
      catch (e) {
        reject(e);
      }

    })
  }

  removeInstrument(track: Track): void {
    track.instrument.destroy();
    track.instrument = null;
    this.saveTrack(track);
  }

  private loadInstrument(instrumentId: Instruments): Promise<Instrument> {
    if (instrumentId === Instruments.DRUMKIT1) return this.loadDrums();
    else throw new Error("not implemented");

  }

  addMidiTrack(project: Project, ghost?: boolean): Track {
    let track = new MidiTrack(this.transportService.getEvents(), this.transportService.getInfo());
    project.tracks.push(track);

    if (!ghost) this.tracksApi.post(TrackMapper.toJSON(track))
      .subscribe(result => {
        track.id = result.id;
        console.log("track saved");
      }, error => this.system.error(error));

    return track;
  }

  addClickTrack(project: Project, ghost?: boolean): Promise<Track> {
    return new Promise((resolve, reject) => {
      this.samplesV2Service.getClickSamples().then(result => {
        let clickTrack = new ClickTrack(this.transportService.getEvents(), this.transportService.getInfo());
        clickTrack.instrument = new Clicker(result.accentSample, result.defaultSample);
        project.tracks.push(clickTrack);
        if (!ghost) this.tracksApi.post(TrackMapper.toJSON(clickTrack))
          .subscribe(result => {
            clickTrack.id = result.id;
            console.log("track saved");
          }, error => this.system.error(error));
        resolve(clickTrack);
      })
        .catch(error => reject(error));
    })

  }

  private saveTrack(track: Track): void {
    this.tracksApi.put(TrackMapper.toJSON(track)).subscribe(result => {
    }, error => this.system.error(error));
  }

  private loadDrums(): Promise<Drums> {
    return new Promise((resolve, reject) => {
      let drums = new Drums();
      this.fileService.getFile(this.config.getAssetsUrl("config/drums/drumkit1.json"))
        .then((config: InstrumentMapping) => {
          let promises = [];
          let urls = config.mappings.map(map => this.config.getAssetsUrl("sounds/drums/drumkit1/" + map.url));
          let promise = this.samplesV2Service.getSamples(urls);
          promises.push(promise);
          promise.then((samples: Array<Sample>) => {
            samples.forEach((sample, i) => {
              let spec = config.mappings[i];
              drums.addTrigger(spec.note, sample);
            })

          }).catch(error => reject(error));

          Promise.all(promises).then(() => resolve(drums)).catch(error => reject(error));
        })
        .catch(error => reject(error));
    })
  }
}
