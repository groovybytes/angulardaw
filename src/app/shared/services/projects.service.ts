import {Inject, Injectable} from "@angular/core";

import {AppConfiguration} from "../../app.configuration";
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
import {AudioContextService} from "./audiocontext.service";
import {MatrixService} from "./matrix.service";
import {FilesApi} from "../../api/files.api";
import {ProjectsApi} from "../../api/projects.api";
import {SamplesApi} from "../../api/samples.api";
import {RecordSession} from "../../model/daw/RecordSession";
import {DawInfo} from "../../model/DawInfo";
import {Lang} from "../../model/utils/Lang";
import {Thread} from "../../model/daw/Thread";
import {Notes} from "../../model/mip/Notes";



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
    @Inject("Notes") private notes: Notes,
    @Inject("daw") private daw: DawInfo,
    private patternsService: PatternsService,
    private pluginsService: PluginsService) {

  }

  initializeNewProject(id: string, name: string, addPlugins: Array<string>): Promise<Project> {

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
      project.threads=this.createThreads();
      project.patterns = [];
      project.id = id;
      project.name = name;
      project.nodes = [];
      //project.session = this.transport.createSession(pattern.plugin);


      //!todo t this.layout.createDefaultLayout();

      let masterBus = this.trackService.createTrack("master-bus",project.nodes, TrackCategory.BUS, null);
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

  /*createProject(id: string, name: string, addPlugins: Array<string>): Promise<Project> {

    return new Promise((resolve, reject) => {
      this.initializeNewProject(id, name, addPlugins)
        .then(project => {
          this.recorderService.recordSession = project.recordSession;
          project.ready = true;
          this.daw.project.next(project);
          resolve(project);

        })
        .catch(error => reject(error));
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
    let ticker = project.threads.find(t => t.id === "ticker");
    let pattern = project.settings.metronomeSettings.pattern = new Pattern(
      "_metronome",
      [],
      ticker,
      project.settings,
      transportContext,
      track.getMasterPlugin(),
      NoteLength.Quarter);

    pattern.length = 4;

    metronomeEvents.forEach(ev => pattern.events.push(ev));

    return pattern;

  }

  /*createMetronomeTrack(project: Project): Promise<Track> {
    return new Promise((resolve, reject) => {
      let metronome = new MetronomePlugin(this.audioContext.getAudioContext(),
        this.filesService, project, this.config, this.samplesService,this.notes);
      metronome.load().then(() => {
        let track = this.trackService.createTrack(project.nodes, TrackCategory.METRONOME, project.getMasterBus().inputNode);//, "metronome-");
        track.plugins = [metronome];
        project.plugins.push(metronome);
        this.pluginsService.setupInstrumentRoutes(project, track, metronome);

        resolve(track);
      })
        .catch(error => reject(error));
    })

  }
*/
  serializeProject(project: Project): ProjectDto {

    let projectDto = new ProjectDto();
    projectDto.id = project.id;
    projectDto.name = project.name;
    projectDto.activePlugin = project.activePlugin.getValue() ? project.activePlugin.getValue().getInstanceId() : null;
    projectDto.transportSettings = project.transportSettings;
    projectDto.metronomeEnabled = project.settings.metronomeSettings.enabled.getValue();
    projectDto.selectedPattern = project.selectedPattern.getValue() ? project.selectedPattern.getValue().id : null;
    projectDto.selectedTrack = project.selectedTrack.getValue() ? project.selectedTrack.getValue().id : null;
    projectDto.tracks = [];
    projectDto.patterns = [];
    projectDto.routes = this.audioNodesService.getRoutes(project.getMasterBus().outputNode);
    projectDto.nodes = project.nodes.map(node => this.audioNodesService.convertNodeToJson(node));
    /*  projectDto.pushKeyBindings = project.pushKeyBindings;
      projectDto.pushSettings = project.pushSettings;*/

    //!todo tprojectDto.desktop = this.layout.serialize();

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
      project.threads=this.createThreads();
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

          debugger;
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


/**ngOnInit() {
  this.metronomeTransport = this.project.metronomePattern.transportContext;

  this.project.deviceEvents.subscribe((deviceEvent: DeviceEvent<any>) => {

    if (this.project.recording.getValue() === true) {
      if (deviceEvent.category === EventCategory.NOTE_ON) {
        let event = deviceEvent.data as NoteOnEvent;
        let noteEvent = NoteEvent.default(event.note);
        noteEvent.time = this.recordTime * 1000;
        noteEvent.length = 0;
        noteEvent.loudness = 1;

        if (this.pattern.insertNote(noteEvent, true)) {
          let updater = setInterval(() => {
            noteEvent.length = this.recordTime * 1000 - noteEvent.time;
            this.pattern.noteUpdated.emit(noteEvent);
          }, 50);
          this.recordingEvents.push({event: deviceEvent, note: noteEvent, updater: updater});
        } else console.log("cant insert note");

      } else if (deviceEvent.category === EventCategory.NOTE_OFF) {
        let noteOffEvent = deviceEvent.data as NoteOffEvent;
        let index = this.recordingEvents
          .findIndex(event =>
            event.note.note === noteOffEvent.note && event.event.deviceId === deviceEvent.deviceId);
        if (index >= 0) {
          this.recordingEvents[index].note.length = this.recordTime * 1000 - this.recordingEvents[index].note.time;
          this.pattern.noteUpdated.emit(this.recordingEvents[index].note);
          clearInterval(this.recordingEvents[index].updater);
          this.recordingEvents.splice(index, 1);
        }


      }
    }
  });

  /!*this.project.recording.subscribe((isRecording) => {
  if (isRecording) {
    this.project.setChannels([]);
    this.project.start();
    this.pattern = this.project.recordSession.pattern;
    let metronomeSubscription = this.metronomeTransport.time.subscribe(event => {

      if (event != null) {
        let bar = MusicMath.getBarNumber(
          event.value * 1000,
          this.metronomeTransport.settings.global.bpm,
          this.project.metronomePattern.quantization.getValue(),
          new TimeSignature(this.metronomeTransport.settings.global.beatUnit, this.metronomeTransport.settings.global.barUnit));
        if (bar === 1) {
          metronomeSubscription.unsubscribe();
          this.pattern.stream.setTimeOffset(event.value);
          this.project.addChannel(this.pattern.id);
          let patternTime = MusicMath.getEndTime(this.pattern.transportContext.settings.loopEnd, this.pattern.transportContext.settings.global.bpm) / 1000;
          this.patternSubscription = this.pattern.transportContext.time.subscribe(event => {
            this.recordTime = (event.value - this.pattern.stream.transportTimeOffset) % patternTime;
          });
          // this.patternsService.stopAndClear(this.project);
          //this.patternsService.togglePattern(this.pattern.id, this.project);

          //this.project.transport.resetStartTime();
          /!* *!/
        }

      }

    });
  }
  else if (isRecording === false) {

    this.patternsService.stopAndClear(this.project);
    this.patternSubscription.unsubscribe();
  }


});*!/

}*/

/* this.deviceSubscription = deviceEvents.subscribe(deviceEvent => {
     if (this.hot.getValue()) {
       if (deviceEvent.category === EventCategory.NOTE_ON) {
         let event = deviceEvent.data as NoteOnEvent;

         let sampleEvent = new SampleEventInfo();
         sampleEvent.note = event.note;
         this.startPlay(sampleEvent);
         this.playingEvents.push(sampleEvent);

       } else if (deviceEvent.category === EventCategory.NOTE_OFF) {
         let event = deviceEvent.data as NoteOffEvent;
         let index = this.playingEvents.findIndex(sampleEvent => sampleEvent.note === event.note);
         this.stopPlay(this.playingEvents[index].node);
         this.playingEvents.splice(index, 1);
       }
     }

   })*/
