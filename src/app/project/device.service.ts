import {Inject, Injectable} from '@angular/core';
import {PushComponent} from "../push/push/push.component";
import {DawInfo} from "../model/DawInfo";
import {PushSettings} from "../push/model/PushSettings";
import {KeyBindings} from "../push/model/KeyBindings";
import {ScaleId} from "../model/mip/scales/ScaleId";
import {InstrumentMapping} from "../model/mip/instruments/drums/spec/InstrumentMapping";
import {Sample} from "../model/daw/Sample";
import {FilesApi} from "../api/files.api";
import {AppConfiguration} from "../app.configuration";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(@Inject("daw") private daw: DawInfo,private fileService: FilesApi, private config: AppConfiguration) {
  }

  setupPush(push: PushComponent): void {
    let project = this.daw.project.getValue();
    push.deviceEvent.subscribe(event => {
      project.deviceEvents2.emit(event);
    });
    //todo:unsubscribe
    if (!this.daw.project.getValue().pushSettings) {
      let settingsCollection = project.pushSettings = [];
      let settings = new PushSettings(this.guid(),"default");
      settingsCollection.push(settings);
      settings.columns = 7;
      settings.rows = 3;
      settings.baseNote = "C2";
      settings.scale = ScaleId.IONIAN;
      settings.keyBindings = KeyBindings.default;

      settings = new PushSettings(this.guid(),"percussion");
      settingsCollection.push(settings);
      settings.columns = 5;
      settings.rows = 3;
      settings.baseNote = "C0";
      settings.scale = ScaleId.CHROMATIC;
      settings.keyBindings = KeyBindings.default;
      settings.noteMappings =[];
      push.settingsCollection=settingsCollection;

      this.fileService.getFile(this.config.getAssetsUrl("config/drums/drumkit1.json"))
        .then((config: InstrumentMapping) => {
          config.mappings.forEach(mapping=>{
            settings.noteMappings.push({
              note:mapping.note,
              label:mapping.instrument,
              url:null
            })
          });

        })
        .catch(error => console.error(error));



    }
    else push.settingsCollection = project.pushSettings;




  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
