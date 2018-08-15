import {Injectable} from "@angular/core";
import {Drums} from "../../model/daw/plugins/Drums";
import {AppConfiguration} from "../../app.configuration";
import {System} from "../../system/System";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {FilesApi} from "../api/files.api";
import {SamplesApi} from "../api/samples.api";
import {Bass} from "../../model/daw/plugins/Bass";
import {TheoryService} from "./theory.service";

@Injectable()
export class PluginsService {

  constructor(
    private fileService: FilesApi,
    private system: System,
    private config: AppConfiguration,
    private theoryService:TheoryService,
    private samplesV2Service: SamplesApi,
  ) {

  }

  loadPlugin(_id: string): Promise<WstPlugin> {
    let plugin:WstPlugin;
    let id=_id.toLowerCase();
    if (id === PluginId.DRUMKIT1) {
      plugin = new Drums(this.fileService,this.config,this.samplesV2Service);
    }
    else if (id === PluginId.BASS1){
      plugin = new Bass(this.theoryService,this.fileService,this.config,this.samplesV2Service);
    }
    else throw new Error("not implemented");

    return plugin.load();

  }


}
