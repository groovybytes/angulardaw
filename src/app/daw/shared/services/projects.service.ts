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
import {Cell} from "../../model/daw/matrix/Cell";
import {WindowSpecs} from "../../model/daw/visual/WindowSpecs";
import {Pattern} from "../../model/daw/Pattern";
import * as _ from "lodash";
import {ProjectDto} from "../../model/daw/dto/ProjectDto";
import {TrackDto} from "../../model/daw/dto/TrackDto";
import {TrackControlParametersDto} from "../../model/daw/dto/TrackControlParametersDto";
import {PatternDto} from "../../model/daw/dto/PatternDto";
import {MatrixDto} from "../../model/daw/dto/MatrixDto";
import {TransportSettings} from "../../model/daw/transport/TransportSettings";
import {GlobalTransportSettings} from "../../model/daw/transport/GlobalTransportSettings";
import {PatternsService} from "./patterns.service";
import {MetronomePlugin} from "../../model/daw/plugins/MetronomePlugin";


@Injectable()
export class ProjectsService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<any>,
    private filesService: FilesApi,
    private trackService: TracksService,
    private config: AppConfiguration,
    private samplesService: SamplesApi,
    private patternsService: PatternsService,
    private pluginsService: PluginsService) {

  }

  createProject(name: string): Project {

    let transportSettings = new TransportSettings();
    transportSettings.global = new GlobalTransportSettings();
    transportSettings.global.beatUnit = 4;
    transportSettings.global.barUnit = 4;
    transportSettings.global.bpm = 120;
    transportSettings.loop = false;
    transportSettings.loopEnd = 0;
    transportSettings.loopStart = 0;

    let project = new Project(this.audioContext, transportSettings);
    project.patterns = [];
    project.id = this.guid();
    project.name = name;
    let sequencerWindow = new WindowSpecs();
    sequencerWindow.id = "sequencer";
    project.windows.push(sequencerWindow);

    let nColumns = 10;
    let nRows = 10;

    for (let i = 0; i < nColumns; i++) {
      project.matrix.header.push(new Cell<Track>(-1, i));
    }
    for (let i = 0; i < nRows; i++) {
      let cell = new Cell<string>(i, -1);
      cell.data = this.guid();
      project.matrix.rowHeader.push(cell);
    }
    for (let i = 0; i < nRows; i++) {
      let row = [];
      project.matrix.body.push(row);
      for (let j = 0; j < nColumns; j++) {
        let cell = new Cell<Pattern>(i, j);
        row.push(cell);
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

  createMetronomePattern(project: Project, track: Track): Pattern {
    let metronomeEvents = this.patternsService.createMetronomeEvents(project.transportSettings.global.beatUnit);
    let transportContext = project.createTransportContext();
    let pattern = new Pattern(
      null,
      [],
      transportContext,
      null,
      track.plugin,
      NoteLength.Quarter,
      track.controlParameters,
      track.gainNode,
      []);

    metronomeEvents.forEach(ev => pattern.events.push(ev));

    return pattern;

  }

  createMetronomeTrack(project: Project): Promise<Track> {

    return new Promise((resolve, reject) => {
      let metronome = new MetronomePlugin(this.audioContext, this.filesService, project, this.config, this.samplesService);
      metronome.load().then(metronome => {
        let track = new Track("_metronome_track", -1, this.audioContext);
        track.plugin = metronome;
        resolve(track);
      })
        .catch(error => reject(error));
    })


  }

  toggleChannel(project: Project, channelId: string, transportSettings?: TransportSettings): void {
    if (project.isRunning([channelId])) project.stop();
    else {
      if (project.channel.getValue() !== channelId) {
        project.channel.next(channelId);
      }
      if (!transportSettings) {
        transportSettings = new TransportSettings();
        transportSettings.global = project.transportSettings.global;
        transportSettings.loop = true;
        transportSettings.loopEnd = 8;
      }

      project.start(channelId, transportSettings);
    }

  }

  private serializeProject(project: Project): ProjectDto {
    let projectDto = new ProjectDto();
    projectDto.id = project.id;
    projectDto.name = project.name;
    projectDto.transportSettings = project.transportSettings;
    projectDto.metronomeEnabled = project.metronomeEnabled;
    projectDto.tracks = [];
    projectDto.patterns = [];
    project.tracks.forEach(track => {
      let trackDto = new TrackDto();
      trackDto.id = track.id;
      trackDto.index = track.index;
      trackDto.name = track.name;
      trackDto.pluginId = track.plugin.getId();
      trackDto.controlParameters = new TrackControlParametersDto();
      trackDto.controlParameters.gain = track.controlParameters.gain.getValue();
      trackDto.controlParameters.mute = track.controlParameters.mute.getValue();
      trackDto.controlParameters.solo = track.controlParameters.solo.getValue();

      projectDto.tracks.push(trackDto);
    });

    project.patterns.forEach(pattern => {
      let patternDto = new PatternDto();
      patternDto.id = pattern.id;
      patternDto.sceneId = pattern.sceneId;
      patternDto.length = pattern.length;
      patternDto.events = pattern.events;
      patternDto.notes = pattern.notes;
      patternDto.quantization = pattern.quantization.getValue();
      patternDto.settings = pattern.transportContext.settings;
      projectDto.patterns.push(patternDto);
    });

    projectDto.matrix = new MatrixDto();
    project.matrix.body.forEach((_row) => {
      let row = [];
      projectDto.matrix.body.push(row);
      _row.forEach((_cell: Cell<Pattern>) => {
        let cell = new Cell<string>(_cell.row, _cell.column);
        cell.trackId = _cell.trackId;
        cell.id = _cell.id;
        if (_cell.data) cell.data = _cell.data.id;
        row.push(cell);
      })
    });

    project.matrix.header.forEach(_cell => {
      let cell = new Cell<string>(_cell.row, _cell.column);
      cell.trackId = _cell.trackId;
      cell.id = _cell.id;
      if (_cell.data) cell.data = _cell.data.id;
      projectDto.matrix.header.push(cell);
    });

    projectDto.matrix.rowHeader = project.matrix.rowHeader;

    return projectDto;
  }

  private deSerializeProject(dto: ProjectDto): Promise<Project> {

    return new Promise<Project>((resolve, reject) => {
      /*   let transportParams = new TransportParams(
           json.quantization,
           json.loopStart,
           json.loopEnd,
           json.loop);*/
      let project = new Project(this.audioContext, dto.transportSettings);
      project.id = dto.id;
      project.name = dto.name;
      project.metronomeEnabled = dto.metronomeEnabled;
      project.sequencerOpen = dto.sequencerOpen;
      project.windows = dto.windows;

      let pluginPromises = [];

      dto.tracks.forEach(t => {
        let track = new Track(t.id, t.index, this.audioContext);
        track.name = t.name;
        track.controlParameters.gain.next(t.controlParameters.gain ? t.controlParameters.gain : 100);
        track.controlParameters.mute.next(t.controlParameters.mute ? t.controlParameters.mute : false);
        track.controlParameters.solo.next(t.controlParameters.solo ? t.controlParameters.solo : false);
        project.tracks.push(track);

        if (t.pluginId) {
          let promise = this.pluginsService.loadPlugin(t.pluginId);
          pluginPromises.push(promise);
          promise.then(plugin => track.plugin = plugin);
        }
      });

      let cells = _.flatten(dto.matrix.body);
      Promise.all(pluginPromises)
        .then(() => {
          dto.patterns.forEach(p => {
            let matrixCell = cells.find(cell => cell.data === p.id);
            if (matrixCell) {
              let pattern = this.patternsService.addPattern(project, matrixCell.trackId, p.quantization, p.sceneId, p.length, p.id);
              p.events.forEach(ev => pattern.events.push(ev));
            }
            else throw new Error("invalid matrix data");

          });
          dto.matrix.body.forEach(_row => {
            let row = [];
            project.matrix.body.push(row);
            _row.forEach(_cell => {
              let cell = new Cell<Pattern>(_cell.row, _cell.column);
              cell.trackId = _cell.trackId;
              cell.id = _cell.id;
              cell.data = project.patterns.find(p => p.id === _cell.data);
              row.push(cell);
            })
          });

          dto.matrix.header.forEach(_cell => {
            let cell = new Cell<Track>(_cell.row, _cell.column);
            cell.trackId = _cell.trackId;
            cell.id = _cell.id;
            cell.data = project.tracks.find(t => t.id === _cell.data);
            project.matrix.header.push(cell);
          });
          project.matrix.rowHeader = dto.matrix.rowHeader;

          if (dto.selectedPattern)
            project
              .selectedPattern
              .next(project.patterns.find(p => p.id === dto.selectedPattern));

          this.createMetronomeTrack(project)
            .then(track => {
              project.systemTracks.push(track);
              this.createMetronomePattern(project, track)
              //project.patterns.push(this.createMetronomePattern(project, track));
              resolve(project);
            })
            .catch(error => reject(error));
        })
        .catch(error => reject(error))
    })
    /*    return new Promise<Project>((resolve, reject) => {
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
              let metronome = new MetronomePlugin(this.audioContext, this.filesService, project, this.config, this.samplesService);
              metronome.load().then(metronome => {
                project.metronomeTrack = this.trackService.createDefaultTrack(0, project.transport);
                project.metronomeTrack.plugin = metronome;
                let pattern = this.trackService.addPattern(project.metronomeTrack);
                pattern.events = this.trackService.createMetronomeEvents(project.metronomeTrack);
                this.trackService.resetEventsWithPattern(project.metronomeTrack, pattern);
                resolve(project);
              })
                .catch(error => reject(error));

            })
            .catch(error => reject(error));

        })*/

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
