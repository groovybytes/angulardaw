import {Injectable} from "@angular/core";
import {Drums} from "../../model/daw/plugins/Drums";
import {FilesApi} from "../../api/files.api";
import {AppConfiguration} from "../../app.configuration";
import {SamplesApi} from "../../api/samples.api";
import {System} from "../../system/System";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {Metronome} from "../../model/daw/plugins/Metronome";
import {Pattern} from "../../model/daw/Pattern";
import * as _ from "lodash";
import {NoteTriggerDto} from "../api/NoteTriggerDto";

@Injectable()
export class PatternsService {

  constructor() {

  }

  insertNote(pattern:Pattern,note: NoteTriggerDto): void {
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index,0,note);
  }

  removeNote(pattern:Pattern,note: NoteTriggerDto): void {
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index,0,note);
  }



}
