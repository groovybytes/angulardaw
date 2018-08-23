import {Inject, Injectable} from "@angular/core";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {FilesApi} from "../api/files.api";
import {TransportService} from "./transport.service";
import {AppConfiguration} from "../../../app.configuration";
import {SamplesApi} from "../api/samples.api";
import {PluginsService} from "./plugins.service";
import {TracksService} from "./tracks.service";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {NoteLength} from "../../model/mip/NoteLength";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {Metronome} from "../../model/daw/components/Metronome";
import {Observable} from "rxjs/internal/Observable";
import {Cell} from "../../model/daw/matrix/Cell";
import {MusicMath} from "../../model/utils/MusicMath";
import {WindowSpecs} from "../../model/daw/visual/WindowSpecs";
import {TrackControlParameters} from "../../model/daw/TrackControlParameters";


@Injectable()
export class ProjectsService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<any>,
    private filesService: FilesApi,
    private trackService: TracksService,
    private transportService: TransportService,
    private config: AppConfiguration,
    private samplesService: SamplesApi,
    private pluginsService: PluginsService) {

  }

  createProject(name: string): Project {
    let project = new Project();
    project.id = this.guid();
    project.name = name;
    let sequencerWindow = new WindowSpecs();
    sequencerWindow.id = "sequencer";
    project.windows.push(sequencerWindow);

    let nColumns = 10;
    let nRows = 10;

    for (let i = 0; i < nColumns; i++) {
      project.matrix.header.push(new Cell<any>(-1, i));
    }
    for (let i = 0; i < nRows; i++) {
      project.matrix.rowHeader.push(new Cell<any>(i, -1));
    }
    for (let i = 0; i < nRows; i++) {
      let row = [];
      project.matrix.body.push(row);
      for (let j = 0; j < nColumns; j++) {
        row.push(new Cell(i, j));
      }

    }

    return project;
  }

  get(projectId: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.projectsApi.get(projectId).subscribe(json => {
        this.deSerializeProject(json)
          .then(project => resolve(project))
          .catch(error => reject(error))
      }, error => reject(error));
    })
  }

  save(project: Project): Observable<void> {
    let json = this.serializeProject(project);
    return this.projectsApi.put(json);
  }

  changeQuantization(project: Project, loopLength: number, quantization: NoteLength): void {
    /* project.quantization=quantization;

     this.transportService.params.tickEnd = pattern.length *
       MusicMath.getBeatTicks(this.transportService.params.quantization.getValue());
     this.transportService.params.tickEnd=MusicMath.
     this.transportService.params.quantization.next(quantization);*/
  }


  private serializeProject(project: Project): any {
    return {
      id: project.id,
      name: project.name,
      bpm: project.bpm,
      quantization: project.quantization,
      beatUnit: project.beatUnit,
      barUnit: project.barUnit,
      metronomeEnabled: project.metronomeEnabled,
      matrix: project.matrix,
      selectedTrackId: project.selectedTrack ? project.selectedTrack.id : null,
      sequencerOpen: project.sequencerOpen,
      windows: project.windows,
      tracks: project.tracks.map(track => ({
        id: track.id,
        name: track.name,
        patterns: track.patterns,
        pluginId: track.pluginId,
        events: track.events,
        focusedPattern: track.focusedPattern ? track.focusedPattern.id : null,
        controlParameters: {
          gain:track.controlParameters.gain.getValue(),
          mute:track.controlParameters.mute.getValue(),
          solo:track.controlParameters.solo.getValue()
        }
      }))
    }
  }

  private deSerializeProject(json: any): Promise<Project> {
    let project = new Project();
    project.id = json.id;
    project.name = json.name;
    project.bpm = json.bpm;
    project.quantization = json.quantization;
    project.metronomeEnabled = json.metronomeEnabled;
    project.barUnit = json.barUnit;
    project.barUnit = json.barUnit;
    project.matrix = json.matrix;
    project.sequencerOpen = json.sequencerOpen;
    project.windows = json.windows;

    json.tracks.forEach(t => {
      let track = new Track(t.id, this.audioContext, this.transportService.getEvents(), this.transportService.getInfo());
      track.name = t.name;
      track.patterns = t.patterns;
      track.pluginId = t.pluginId;
      track.events = t.events;
      track.controlParameters.gain.next(t.controlParameters.gain?t.controlParameters.gain:100);
      track.controlParameters.mute.next(t.controlParameters.mute?t.controlParameters.mute:false);
      track.controlParameters.solo.next(t.controlParameters.solo?t.controlParameters.solo:false);
      project.tracks.push(track);
      track.focusedPattern = t.focusedPattern ? track.patterns.find(p => p.id === t.focusedPattern) : null;
      if (track.focusedPattern) this.trackService.resetEventsWithPattern(track, track.focusedPattern.id);
    });
    project.selectedTrack = json.selectedTrackId ? project.tracks.find(t => t.id === json.selectedTrackId) : null;

    return new Promise<Project>((resolve, reject) => {
      this.transportService.params.quantization = new BehaviorSubject<NoteLength>(project.quantization);
      this.transportService.params.bpm = new BehaviorSubject<number>(project.bpm);
      this.transportService.params.signature =
        new BehaviorSubject<TimeSignature>(new TimeSignature(project.beatUnit, project.barUnit));

      this.transportService.params.loop = new BehaviorSubject(true);

      let promises = [];
      project.tracks.forEach(track => {
        if (track.pluginId) {
          let promise = this.pluginsService.loadPlugin(track.pluginId);
          promises.push(promise);
          promise.then(plugin => track.plugin = plugin);
        }
      });


      Promise.all(promises)
        .then(() => {
          let metronome = new Metronome(this.audioContext, this.filesService, project, this.config, this.transportService, this.samplesService);
          metronome.load().then(metronome => {
            project.metronome = metronome;
            resolve(project);
          })
            .catch(error => reject(error));
          resolve(project);

        })
        .catch(error => reject(error));

    })

  }


  /*  setPlugin(track: Track, id: string): Promise<WstPlugin> {
      return new Promise<WstPlugin>((resolve, reject) => {
        try {
          if (track.plugin) track.plugin.destroy();
          track.plugin = null;
          this.pluginsService.loadPlugin(id)
            .then(plugin => {
              track.plugin = plugin;
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



    onPatternChanged(track: Track, pattern: PatternViewModel, transportParams: TransportParams): void {
      if (track) {
        track.resetEvents(pattern.events);
        pattern.notes = track.plugin.getNotes().reverse();
      }

      transportParams.tickEnd =
        pattern.length * MusicMath.getBeatTicks(transportParams.quantization.getValue());
    }*/


  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
