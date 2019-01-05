import {Inject, Injectable} from '@angular/core';
import {PushComponent} from "../push/push/push.component";
import {DawInfo} from "../model/DawInfo";
import {PushSettings} from "../push/model/PushSettings";
import {KeyBindings} from "../push/model/KeyBindings";
import {ScaleId} from "../model/mip/scales/ScaleId";
import {InstrumentMapping} from "../model/mip/instruments/drums/spec/InstrumentMapping";
import {FilesApi} from "../api/files.api";
import {AppConfiguration} from "../app.configuration";
import {DeviceEvent} from "../model/daw/devices/DeviceEvent";
import {EventCategory} from "../model/daw/devices/EventCategory";
import {ProjectsService} from "../shared/services/projects.service";
import {NoteOnEvent} from "../model/mip/NoteOnEvent";
import {Lang} from "../model/utils/Lang";
import {MakeMusicService} from "../shared/services/make-music.service";
import {NoteOffEvent} from "../model/mip/NoteOffEvent";
import {PatternsService} from "../shared/services/patterns.service";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    @Inject("daw") private daw: DawInfo,
    private fileService: FilesApi,
    private makeMusicSerice: MakeMusicService,
    private patternsService:PatternsService,
    private projectsService: ProjectsService,
    private config: AppConfiguration) {
  }

  setupPush(push: PushComponent): void {
    let project = this.daw.project.getValue();
    push.deviceEvent.subscribe(event => {
      project.deviceEvents2.emit(event);
    });

    //todo:unsubscribe
    if (!project.pushSettings) {
      let settingsCollection = project.pushSettings = [];
      let settings = new PushSettings(Lang.guid(), "default","default");
      settingsCollection.push(settings);
      settings.columns = 7;
      settings.rows = 3;
      settings.baseNote = "C2";
      settings.scale = ScaleId.IONIAN;
      settings.keyBindings = KeyBindings.default;

      settings = new PushSettings(Lang.guid(), "percussion","percussion");
      settingsCollection.push(settings);
      settings.columns = 5;
      settings.rows = 3;
      settings.baseNote = "C0";
      settings.scale = ScaleId.CHROMATIC;
      settings.keyBindings = KeyBindings.default;
      settings.noteMappings = [];
      push.settingsCollection = settingsCollection;

      push.plugin = project.activePlugin;
      push.availablePlugins = project.plugins;//.filter(plugin => plugin.getInfo().category !== "system");

      this.fileService.getFile(this.config.getAssetsUrl("config/drums/drumkit1.json"))
        .then((config: InstrumentMapping) => {
          config.mappings.forEach(mapping => {
            settings.noteMappings.push({
              note: mapping.note,
              label: mapping.instrument,
              url: null
            })
          });

        })
        .catch(error => console.error(error));


    } else push.settingsCollection = project.pushSettings;


  }

  handleDeviceEvent(event: DeviceEvent<any>): void {
    console.log("new device event: " + JSON.stringify(event));
    let project = this.daw.project.getValue();
    if (event.category === EventCategory.RECORD_TOGGLE) {
      if (project.recordSession.state.getValue()===0) {
        project.recordSession.state.next(1);
        project.recordSession.pattern=project.selectedPattern.getValue();
      }
      this.patternsService.togglePattern(project.selectedPattern.getValue().id);
    } else if (event.category === EventCategory.SET_PLUGIN) {
      let plugin = project.plugins.find(plugin => plugin.getInstanceId() === event.data);
      project.activePlugin.next(plugin);
    } else if (event.category === EventCategory.NOTE_ON) {
      let noteOnEvent = event.data as NoteOnEvent;
      this.makeMusicSerice.startPlay(noteOnEvent.note);
      //this.recorderService.recordNoteStart(noteOnEvent,event.deviceId);
    } else if (event.category === EventCategory.NOTE_OFF) {
      let noteEvent = event.data as NoteOffEvent;
      this.makeMusicSerice.stopPlay(noteEvent.note);
      //this.recorderService.recordNoteEnd(noteEvent,event.deviceId);
    }

    /*else if (event.category === EventCategory.RECORD_TOGGLE) {
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

    }*/
  }


}
