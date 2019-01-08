import {Inject, Injectable} from "@angular/core";
import {AppConfiguration} from "../../app.configuration";
import {PluginsService} from "./plugins.service";
import {TracksService} from "./tracks.service";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {Cell} from "../../model/daw/matrix/Cell";
import {Pattern} from "../../model/daw/Pattern";
import * as _ from "lodash";
import {ProjectDto} from "../../model/daw/dto/ProjectDto";
import {PatternDto} from "../../model/daw/dto/PatternDto";
import {MatrixDto} from "../../model/daw/dto/MatrixDto";
import {PatternsService} from "./patterns.service";
import {AudioNodesService} from "./audionodes.service";
import {TrackCategory} from "../../model/daw/TrackCategory";
import {AudioContextService} from "./audiocontext.service";
import {MatrixService} from "./matrix.service";
import {FilesApi} from "../../api/files.api";
import {ProjectsApi} from "../../api/projects.api";
import {SamplesApi} from "../../api/samples.api";
import {DawInfo} from "../../model/DawInfo";
import {Lang} from "../../model/utils/Lang";
import {Thread} from "../../model/daw/Thread";
import {Notes} from "../../model/mip/Notes";
import {ApiResponse} from "../../api/ApiResponse";
import {TransportSession} from "../../model/daw/session/TransportSession";
import {Metronome} from "../../model/daw/Metronome";


@Injectable()
export class ProjectsService {

  constructor(
    private audioContext: AudioContextService,
    private projectsApi: ProjectsApi,
    private filesService: FilesApi,
    private matrixService: MatrixService,
    private trackService: TracksService,
    private samplesV2Service: SamplesApi,
    private config: AppConfiguration,
    private audioNodesService: AudioNodesService,
    private samplesService: SamplesApi,
    @Inject("Notes") private notes: Notes,
    @Inject("daw") private daw: DawInfo,
    private patternsService: PatternsService,
    private pluginsService: PluginsService) {

  }

  createProjectSkeleton(id: string, name: string, addPlugins: Array<string>): Promise<Project> {

    return new Promise((resolve, reject) => {

      let project = new Project(this.audioContext);
      project.threads = this.createThreads();
      project.patterns = [];
      project.id = id;
      project.name = name;
      project.nodes = [];

      let masterBus = this.trackService.createTrack("master-bus", project.nodes, TrackCategory.BUS, null);
      masterBus.category = TrackCategory.BUS;
      project.tracks.push(masterBus);

      let nColumns = 0;
      let nRows = 0;

      for (let i = 0; i < nColumns; i++) {
        project.matrix.header.push(new Cell<Track>(-1, i));
      }
      for (let i = 0; i < nRows; i++) {
        let cell = new Cell<string>(i, -1);
        cell.data = Lang.guid();
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
              resolve(project);

              /* this.createMetronomeTrack(project)
                 .then(track => {
                   project.tracks.push(track);
                   this.createMetronomePattern(project, track);
                   resolve(project);
                 })
                 .catch(error => reject(error))*/
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error));
    })

  }

  saveProject(project:Project): Promise<void> {
    return new Promise<void>(((resolve, reject) => {
      let dto = this.serializeProject(project);
      return this.projectsApi.update(dto)
        .then((result: ApiResponse<void>) => {
          resolve();
        })
        .catch(error => reject(error));
    }))

  }

  getProject(projectId: string): Promise<Project> {
    return new Promise<Project>(((resolve, reject) => {
      this.projectsApi.getById(projectId).then(result => {
        this.deSerializeProject(result.data)
          .then(project => {
            resolve(project);
          })
          .catch(error => reject(error));
      })

    }))

  }

  initializeProject(project: Project): Promise<void> {
    return new Promise<void>(((resolve, reject) => {

      project.session = new TransportSession(
        project.events,
        project.recordSession,
        project.threads.find(t => t.id === "ticker"),
        (note1, note2) => this.notes.getInterval(this.notes.getNote(note1), this.notes.getNote(note2)) * 100,
        (targetId, note) => project.plugins.find(plugin => plugin.getInstanceId() === targetId).getSample(note),
        this.audioContext.getAudioContext(),
        project.settings.bpm);

      this.samplesV2Service.getClickSamples().then(result => {
        project.metronome = new Metronome(
          this.audioContext.getAudioContext(),
          project.events,
          this.daw.destroy,
          project.settings.metronomeSettings.enabled,
          result.accentSample.buffer,
          result.defaultSample.buffer);

        resolve();
      })
        .catch(error=>reject(error));

    }));

  }

  private serializeProject(project: Project): ProjectDto {

    let projectDto = new ProjectDto();
    projectDto.id = project.id;
    projectDto.name = project.name;
    projectDto.activePlugin = project.activePlugin.getValue() ? project.activePlugin.getValue().getInstanceId() : null;
    projectDto.metronomeEnabled = project.settings.metronomeSettings.enabled.getValue();
    projectDto.selectedPattern = project.selectedPattern.getValue() ? project.selectedPattern.getValue().id : null;
    projectDto.selectedTrack = project.selectedTrack.getValue() ? project.selectedTrack.getValue().id : null;
    projectDto.tracks = [];
    projectDto.patterns = [];
    projectDto.routes = this.audioNodesService.getRoutes(project.getMasterBus().outputNode);
    projectDto.nodes = project.nodes.map(node => this.audioNodesService.convertNodeToJson(node));

    project.tracks.forEach(track => {
      let trackDto = this.trackService.convertTrackToJson(track);
      projectDto.tracks.push(trackDto);
    });


    project.patterns.forEach(pattern => {
      let patternDto = new PatternDto();
      patternDto.id = pattern.id;
      patternDto.length = pattern.length;
      patternDto.events = pattern.events;
      patternDto.triggers = pattern.triggers;
      patternDto.quantizationEnabled = pattern.quantizationEnabled.getValue();
      patternDto.quantization = pattern.quantization.getValue();

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

  private deSerializeProject(dto: ProjectDto): Promise<Project> {

    return new Promise<Project>((resolve, reject) => {
      let project = new Project(this.audioContext);
      project.threads = this.createThreads();
      project.id = dto.id;
      project.name = dto.name;
      project.settings.metronomeSettings.enabled.next(dto.metronomeEnabled);
      project.nodes = this.audioNodesService.convertNodesFromJson(dto.nodes, dto.routes);
      project.pushSettings = dto.pushSettings;
      project.pushKeyBindings = dto.pushKeyBindings;

      //!todo t this.layout.deSerialize(dto.desktop);

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
              if (pluginDto.pad) {
                pluginInfo.pad = pluginDto.pad;//override default pads
              }
              let promise = this.pluginsService.loadPluginWithInfo(pluginDto.id, pluginDto.instanceId, pluginInfo, project);
              pluginPromises.push(promise);
              promise.then(_plugin => {

                _plugin.setInputNode(project.nodes.find(n => n.id === pluginDto.inputNode));
                _plugin.setOutputNode(project.nodes.find(n => n.id === pluginDto.outputNode));
                _plugin.hot.next(track.controlParameters.record.getValue());
                track.plugins.push(_plugin);
                project.plugins.push(_plugin);
              });
            })
          });

          project.getMasterBus().outputNode.node.connect(this.audioContext.getAudioContext().destination);
          let cells = _.flatten(dto.matrix.body);
          Promise.all(pluginPromises)
            .then(() => {

              if (dto.activePlugin) {
                let plugin = project.plugins.find(plugin => plugin.getInstanceId() === dto.activePlugin);
                project.activePlugin.next(plugin);
              }
              //let metronomeTrack = project.tracks.find(track => track.category===TrackCategory.METRONOME);
              //project.settings.metronomeSettings.pattern = this.createMetronomePattern(project, metronomeTrack);

              dto.patterns.forEach(p => {
                let matrixCell = cells.find(cell => cell.data === p.id);
                if (matrixCell) {
                  let pattern = this.patternsService.createPattern(project, matrixCell.trackId, p.quantization, p.length, p.id);
                  pattern.quantizationEnabled.next(p.quantizationEnabled);
                  p.events.forEach(ev => pattern.events.push(ev));
                  pattern.length = p.length;
                } else console.warn("invalid settings data");

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


              resolve(project);

              /*this.createMetronomeTrack(project)
                .then(track => {
                  this.createMetronomePattern(project, track);
                  console.log("deserialize:"+project.nodes.length);
                  resolve(project);
                })
                .catch(error => reject(error));*/
            })
            .catch(error => reject(error))
        })
        .catch(error => reject(error))

    })

  }

  private createThreads(): Array<Thread> {
    return [new Thread("ticker", "assets/js/tick_worker.js")];
  }

}

