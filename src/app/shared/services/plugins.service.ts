import {Injectable} from "@angular/core";
import {Drums} from "../../model/daw/plugins/Drums";
import {FilesApi} from "../../api/files.api";
import {AppConfiguration} from "../../app.configuration";
import {SamplesApi} from "../../api/samples.api";
import {System} from "../../system/System";
import {PluginId} from "../../model/daw/plugins/PluginId";
import {WstPlugin} from "../../model/daw/WstPlugin";
import {Metronome} from "../../model/daw/plugins/Metronome";

@Injectable()
export class PluginsService {

  constructor(
    private fileService: FilesApi,
    private system: System,
    private config: AppConfiguration,
    private samplesV2Service: SamplesApi,
  ) {

  }

  loadPlugin(_id: string): Promise<WstPlugin> {
    let plugin:WstPlugin;
    let id=_id.toLowerCase();
    if (id === PluginId.DRUMKIT1) {
      plugin = new Drums(this.fileService,this.config,this.samplesV2Service);
    }
    else if (id === PluginId.METRONOME){
      plugin = new Metronome(this.fileService,this.config,this.samplesV2Service);
    }
    else throw new Error("not implemented");

    return plugin.load();

  }


}
