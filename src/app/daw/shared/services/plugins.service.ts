import {Injectable} from "@angular/core";
import {Drums} from "../../model/daw/plugins/Drums";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {FilesApi} from "../api/files.api";
import {SamplesApi} from "../api/samples.api";
import {Bass} from "../../model/daw/plugins/Bass";
import {TheoryService} from "./theory.service";
import {Piano} from "../../model/daw/plugins/Piano";
import {System} from "../../../system/System";
import {AppConfiguration} from "../../../app.configuration";
import {PluginInfo} from "../../model/daw/plugins/PluginInfo";

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

  getPluginList():Array<PluginInfo>{
    return [Drums.getInfo(),Bass.getInfo(),Piano.getInfo()];
  }

  loadPlugin(_id: string): Promise<WstPlugin> {
    let plugin:WstPlugin;
    let id=_id.toLowerCase();
    if (id === PluginId.DRUMKIT1) {
      plugin = new Drums(this.fileService,this.config,this.samplesV2Service);
    }
    else if (id === PluginId.BASS1){
      plugin = new Bass(this.theoryService,this.fileService,this.samplesV2Service);
    }
    else if (id === PluginId.PIANO1){
      plugin = new Piano(this.theoryService,this.fileService,this.config,this.samplesV2Service);
    }
    else throw new Error("not implemented");

    return plugin.load();

  }


}