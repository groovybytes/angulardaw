import {Inject, Injectable} from "@angular/core";
import {FilesApi} from "../api/files.api";
import {AppConfiguration} from "../../../app.configuration";
import {SamplesApi} from "../api/samples.api";
import {PluginsService} from "./plugins.service";
import {TracksService} from "./tracks.service";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {NoteLength} from "../../model/mip/NoteLength";
import {Cell} from "../../model/daw/matrix/Cell";
import {Pattern} from "../../model/daw/Pattern";
import * as _ from "lodash";
import {ProjectDto} from "../../model/daw/dto/ProjectDto";
import {PatternDto} from "../../model/daw/dto/PatternDto";
import {MatrixDto} from "../../model/daw/dto/MatrixDto";
import {TransportSettings} from "../../model/daw/transport/TransportSettings";
import {GlobalTransportSettings} from "../../model/daw/transport/GlobalTransportSettings";
import {PatternsService} from "./patterns.service";
import {MetronomePlugin} from "../../model/daw/plugins/MetronomePlugin";
import {AudioNodesService} from "./audionodes.service";
import {TrackCategory} from "../../model/daw/TrackCategory";
import {AudioNodeTypes} from "../../model/daw/AudioNodeTypes";
import {VirtualAudioNode} from "../../model/daw/VirtualAudioNode";
import {DesktopManager} from "../../model/daw/visual/desktop/DesktopManager";
import {DesktopDto} from "../../model/daw/dto/DesktopDto";
import {AudioContextService} from "./audiocontext.service";
import {PluginInfo} from "../../model/daw/plugins/PluginInfo";
import {TrackDto} from "../../model/daw/dto/TrackDto";
import {AudioNodeDto} from "../../model/daw/dto/AudioNodeDto";
import {TrackControlParametersDto} from "../../model/daw/dto/TrackControlParametersDto";
import {PluginDto} from "../../model/daw/dto/PluginDto";
import {MatrixService} from "./matrix.service";
import {ProjectsApi} from "../api/projects.api";


@Injectable()
export class ProjectsService {

  constructor(
    private audioContext: AudioContextService,
     private projectsApi: ProjectsApi,
    private filesService: FilesApi,
    private matrixService: MatrixService,
    private trackService: TracksService,
    private config: AppConfiguration,
    private audioNodesService: AudioNodesService,
    private samplesService: SamplesApi,
    private patternsService: PatternsService,
    private pluginsService: PluginsService) {

  }

  createProject(name: string, addPlugins: Array<string>): Promise<Project> {

    return new Promise((resolve, reject) => {
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
      project.openedWindows = [];
      project.nodes = [];
      let masterBus = this.trackService.createTrack(project.nodes, TrackCategory.BUS, null);
      masterBus.category = TrackCategory.BUS;
      project.tracks.push(masterBus);

      let nColumns = 0;
      let nRows = 0;

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


      this.filesService.getFile(this.config.getAssetsUrl("plugins.json"))
        .then(plugins => {
          project.pluginTypes = plugins;
          let promises = [];
          addPlugins.forEach(plugin => {
            promises.push(this.matrixService.addMatrixColumnWithPlugin(project.pluginTypes.find(_plugin => _plugin.id === plugin), project));
          });
          Promise.all(promises)
            .then(() => {
              this.createMetronomeTrack(project)
                .then(track => {
                  this.createMetronomePattern(project, track);
                  resolve(project);
                })
                .catch(error => reject(error))
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error));
    })

  }

  createProject2(name: string, instruments: Array<PluginInfo>): any {
    let json = {
      "tracks": [
        {
          "id": "track-1",
          "name": "default-name",
          "color": "red",
          "category": 1,
          "plugins": [],
          "inputNode": "node-2",
          "outputNode": "node-3",
          "controlParameters": {
            "gain": 100,
            "mute": false,
            "solo": false
          }
        }
      ],
      "id": this.guid(),
      "name": name,
      "transportSettings": {
        "global": {
          "beatUnit": 4,
          "barUnit": 4,
          "bpm": 120
        },
        "loop": false,
        "loopEnd": 0,
        "loopStart": 0
      },
      "metronomeEnabled": true,
      "openedWindows": [],
      "selectedPattern": null,
      "selectedTrack": null,
      "patterns": [],
      "routes": [
        {
          "source": "node-2",
          "target": "node-3"
        }
      ],
      "nodes": [
        {
          "id": "node-2",
          "nodeType": 2,
          "status": null,
          "meta": "track: track-1"
        },
        {
          "id": "node-3",
          "nodeType": 1,
          "status": null,
          "meta": "track: track-1"
        }
      ],
      "desktop": {
        "windows": []
      },
      "matrix": {
        "body": [],
        "header": [],
        "rowHeader": []
      }
    }

    return json;

  }

 /* get(projectId: string): Promise<Project> {
    return new Promise((resolve, reject) => {

      this.projectsApi.getById(projectId).then(json => {

        this.deSerializeProject(json)
          .then(project => resolve(project))
          .catch(error => reject(error))
      })
        .catch(error => {

          reject(error)
        });
    })
  }

  save(project: Project): Promise<void> {
    return new Promise((resolve, reject) => {
      this.projectsApi.getById(project.id).then(_project => {
        let json = this.serializeProject(project);
        if (!_project) {
          json.id=this.guid();
          this.projectsApi.create(json).then(project => resolve(), error => reject(error));
        }
        else this.projectsApi.update(json).then(project => resolve(), error => reject(error));
      });
    })

  }*/

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
    transportContext.settings.loopEnd = project.transportSettings.global.beatUnit;
    let pattern = project.metronomePattern = new Pattern(
      "_metronome",
      [],
      transportContext,
      track.getInstrumentPlugin(),
      NoteLength.Quarter,
      track.controlParameters);

    metronomeEvents.forEach(ev => pattern.events.push(ev));

    return pattern;

  }

  createMetronomeTrack(project: Project): Promise<Track> {
    return new Promise((resolve, reject) => {
      let metronome = new MetronomePlugin(this.audioContext.getAudioContext(), this.filesService, project, this.config, this.samplesService);
      metronome.load().then(metronome => {
        let track = this.trackService.createTrack(project.nodes, TrackCategory.SYSTEM, project.getMasterBus().inputNode, "metronome-");
        track.plugins = [metronome];
        project.plugins.push(metronome);
        this.pluginsService.setupInstrumentRoutes(project, track, metronome);

        resolve(track);
      })
        .catch(error => reject(error));
    })

  }

  serializeProject(project: Project): ProjectDto {
    let projectDto = new ProjectDto();
    projectDto.id = project.id;
    projectDto.name = project.name;
    projectDto.transportSettings = project.transportSettings;
    projectDto.metronomeEnabled = project.metronomeEnabled.getValue();
    projectDto.openedWindows = project.openedWindows;
    projectDto.selectedPattern = project.selectedPattern.getValue() ? project.selectedPattern.getValue().id : null;
    projectDto.selectedTrack = project.selectedTrack.getValue() ? project.selectedTrack.getValue().id : null;
    projectDto.tracks = [];
    projectDto.patterns = [];
    projectDto.routes = this.audioNodesService.getRoutes(project.getMasterBus().outputNode);
    projectDto.nodes = project.nodes.map(node => this.audioNodesService.convertNodeToJson(node));
    projectDto.desktop = new DesktopDto();
    projectDto.desktop.windows = project.desktop.windows;

    project.tracks.forEach(track => {
      let trackDto = this.trackService.convertTrackToJson(track);
      projectDto.tracks.push(trackDto);
    });

    project.patterns.forEach(pattern => {
      let patternDto = new PatternDto();
      patternDto.id = pattern.id;
      patternDto.length = pattern.length;
      patternDto.events = pattern.events;
      patternDto.notes = pattern.notes;
      patternDto.quantizationEnabled = pattern.quantizationEnabled.getValue();
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
    projectDto.matrix.rowHeader.forEach(cell => cell.animation = null);

    return projectDto;
  }

  deSerializeProject(dto: ProjectDto): Promise<Project> {

    return new Promise<Project>((resolve, reject) => {
      let project = new Project(this.audioContext, dto.transportSettings);
      project.id = dto.id;
      project.name = dto.name;
      project.metronomeEnabled.next(dto.metronomeEnabled);
      project.openedWindows = dto.openedWindows;
      project.nodes = this.audioNodesService.convertNodesFromJson(dto.nodes, dto.routes);
      project.desktop = new DesktopManager();
      project.desktop.windows = dto.desktop.windows;

      this.filesService.getFile(this.config.getAssetsUrl("plugins.json"))
        .then(plugins => {
          project.pluginTypes = plugins;
          let pluginPromises = [];

          dto.tracks.forEach(t => {
            let track = this.trackService.convertTrackFromJson(t, project.nodes);
            project.tracks.push(track);
            track.plugins = [];
            t.plugins.forEach(pluginDto => {
              let pluginInfo = project.pluginTypes.find(p => p.id === pluginDto.pluginTypeId);
              if (!pluginInfo) throw "plugin not found with id " + pluginDto.pluginTypeId;
              let promise = this.pluginsService.loadPluginWithInfo(pluginDto.id, pluginInfo);
              pluginPromises.push(promise);
              promise.then(_plugin => {
                _plugin.setInputNode(project.nodes.find(n => n.id === pluginDto.inputNode));
                _plugin.setOutputNode(project.nodes.find(n => n.id === pluginDto.outputNode));
                track.plugins.push(_plugin);
                project.plugins.push(_plugin);
              });
            })
          });

          project.getMasterBus().outputNode.node.connect(this.audioContext.getAudioContext().destination);
          let cells = _.flatten(dto.matrix.body);
          Promise.all(pluginPromises)
            .then(() => {
              dto.patterns.forEach(p => {
                let matrixCell = cells.find(cell => cell.data === p.id);
                if (matrixCell) {
                  let pattern = this.patternsService.addPattern(project, matrixCell.trackId, p.quantization, p.length, p.id);
                  pattern.quantizationEnabled.next(p.quantizationEnabled);
                  p.events.forEach(ev => pattern.events.push(ev));
                  pattern.length = p.length;
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

              if (dto.selectedTrack)
                project
                  .selectedTrack
                  .next(project.tracks.find(t => t.id === dto.selectedTrack));

              this.createMetronomeTrack(project)
                .then(track => {
                  this.createMetronomePattern(project, track);
                  resolve(project);
                })
                .catch(error => reject(error));
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))

    })

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
