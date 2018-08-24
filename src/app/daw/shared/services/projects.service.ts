import {Inject, Injectable} from "@angular/core";
import {ApiEndpoint} from "../api/ApiEndpoint";
import {FilesApi} from "../api/files.api";
import {AppConfiguration} from "../../../app.configuration";
import {SamplesApi} from "../api/samples.api";
import {PluginsService} from "./plugins.service";
import {TracksService} from "./tracks.service";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {NoteLength} from "../../model/mip/NoteLength";
import {Observable} from "rxjs/internal/Observable";
import {Cell} from "../../model/daw/matrix/Cell";
import {WindowSpecs} from "../../model/daw/visual/WindowSpecs";
import {Transport} from "../../model/daw/transport/Transport";
import {TransportParams} from "../../model/daw/transport/TransportParams";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {Metronome} from "../../model/daw/components/Metronome";
import {NoteTrigger} from "../../model/daw/NoteTrigger";
import {MusicMath} from "../../model/utils/MusicMath";
import {TransportReader} from "../../model/daw/transport/TransportReader";
import {PerformanceStreamer} from "../../model/daw/events/PerformanceStreamer";


@Injectable()
export class ProjectsService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<any>,
    private filesService: FilesApi,
    private trackService: TracksService,
    private config: AppConfiguration,
    private samplesService: SamplesApi,
    private pluginsService: PluginsService) {

  }

  createProject(name: string): Project {
    let transportParams = new TransportParams(NoteLength.Quarter, 0, 1000, true);
    let project = new Project(this.audioContext, transportParams, 120, new TimeSignature(4, 4));
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

  save(project: Project): Promise<void> {
    return new Promise((resolve, reject) => {
      this.projectsApi.get(project.id).subscribe(_project => {
        let json = this.serializeProject(project);
        if (!_project) this.projectsApi.post(json).subscribe(project => resolve(), error => reject(error));
        else this.projectsApi.put(json).subscribe(project => resolve(), error => reject(error));
      }, error => reject(error));
    })

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
      bpm: project.transport.getBpm(),
      quantization: project.transport.getQuantization(),
      beatUnit: project.transport.getSignature().beatUnit,
      barUnit: project.transport.getSignature().barUnit,
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
        quantization: track.transport.getQuantization(),
        loopStart: track.transport.getLoopStart(),
        loopEnd: track.transport.getLoopEnd(),
        loop: track.transport.isLoop(),
        events: track.events,
        focusedPattern: track.focusedPattern ? track.focusedPattern.id : null,
        controlParameters: {
          gain: track.controlParameters.gain.getValue(),
          mute: track.controlParameters.mute.getValue(),
          solo: track.controlParameters.solo.getValue()
        }
      }))
    }
  }

  private deSerializeProject(json: any): Promise<Project> {

    let transportParams = new TransportParams(
      json.quantization,
      json.loopStart,
      json.loopEnd,
      json.loop);


    let project = new Project(this.audioContext, transportParams, json.bpm, new TimeSignature(json.beatUnit, json.barUnit));
    let masterParams = project.transport.masterParams;
    project.id = json.id;
    project.name = json.name;
    project.metronomeEnabled = json.metronomeEnabled;
    project.matrix = json.matrix;
    project.sequencerOpen = json.sequencerOpen;
    project.windows = json.windows;

    json.tracks.forEach(t => {
      let transportParams = new TransportParams(
        t.quantization,
        t.loopStart,
        t.loopEnd,
        t.loop);

      let track = new Track(t.id, this.audioContext, new Transport(this.audioContext, transportParams, masterParams));
      track.name = t.name;
      track.patterns = t.patterns;
      track.pluginId = t.pluginId;
      track.events = t.events;
      track.controlParameters.gain.next(t.controlParameters.gain ? t.controlParameters.gain : 100);
      track.controlParameters.mute.next(t.controlParameters.mute ? t.controlParameters.mute : false);
      track.controlParameters.solo.next(t.controlParameters.solo ? t.controlParameters.solo : false);
      project.tracks.push(track);
      track.focusedPattern = t.focusedPattern ? track.patterns.find(p => p.id === t.focusedPattern) : null;
      if (track.focusedPattern) this.trackService.resetEventsWithPattern(track, track.focusedPattern.id);
    });
    project.selectedTrack = json.selectedTrackId ? project.tracks.find(t => t.id === json.selectedTrackId) : null;

    return new Promise<Project>((resolve, reject) => {
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
          let metronome = new Metronome(this.audioContext, this.filesService, project, this.config, this.samplesService);
          metronome.load().then(metronome => {
            project.metronomeTrack = this.trackService.createDefaultTrack(project.transport.masterParams);
            project.metronomeTrack.plugin=metronome;
            let pattern = this.trackService.addPattern(project.metronomeTrack);
            pattern.events = this.trackService.createMetronomeEvents(project.metronomeTrack);
            this.trackService.resetEventsWithPattern(project.metronomeTrack,pattern.id);
            resolve(project);
          })
            .catch(error => reject(error));

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
