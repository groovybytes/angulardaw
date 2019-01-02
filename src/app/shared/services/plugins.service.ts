import {Inject, Injectable} from "@angular/core";
import {System} from "../../system/System";
import {AppConfiguration} from "../../app.configuration";
import {PluginInfo} from "../../model/daw/plugins/PluginInfo";
import {Drums} from "../../model/daw/plugins/Drums";
import * as _ from "lodash";
import {Track} from "../../model/daw/Track";
import {AudioNodeTypes} from "../../model/daw/AudioNodeTypes";
import {AudioNodesService} from "./audionodes.service";
import {Project} from "../../model/daw/Project";
import {FilesApi} from "../../api/files.api";
import {SamplesApi} from "../../api/samples.api";
import {Notes} from "../../model/mip/Notes";
import {MetronomePlugin} from "../../model/daw/plugins/MetronomePlugin";
import {AudioContextService} from "./audiocontext.service";
import {AudioPlugin} from "../../model/daw/plugins/AudioPlugin";
import {InstrumentSampler} from "../../model/daw/plugins/InstrumentSampler";
import {Lang} from "../../model/utils/Lang";

@Injectable()
export class PluginsService {

  constructor(
    private fileService: FilesApi,
    private system: System,
    private config: AppConfiguration,
    @Inject("Notes") private notes: Notes,
    private nodesService: AudioNodesService,
    private audioContext: AudioContextService,
    private samplesV2Service: SamplesApi,
  ) {

  }

  /*loadPlugin(_id: string): Promise<WstPlugin> {
    let plugin: WstPlugin;
    let id = _id.toLowerCase();
    if (id === PluginId.DRUMKIT1) {
      //plugin = new Drums(this.fileService, this.config, this.samplesV2Service);
    }
    else if (id === PluginId.BASS1) {
      //plugin = new Bass(this.theoryService, this.fileService, this.samplesV2Service);
    }
    else if (id === PluginId.PIANO1) {
      //plugin = new Piano(this.theoryService, this.fileService, this.config, this.samplesV2Service);
    }
    else {
      throw "not found";
    }

    return plugin.load();

  }*/

  setupInstrumentRoutes(project: Project, track: Track, plugin: AudioPlugin): void {
    let meta = "plugin_" + plugin.getInfo().name;

    let inputNode = this.nodesService.createVirtualNode(Lang.guid(), AudioNodeTypes.PANNER, meta);
    let outputNode = this.nodesService.createVirtualNode(Lang.guid(), AudioNodeTypes.GAIN, meta);
    plugin.setInputNode(inputNode);
    plugin.setOutputNode(outputNode);

    project.nodes.push(inputNode);
    project.nodes.push(outputNode);
    track.inputNode.connect(inputNode);
    inputNode.connect(outputNode);
    outputNode.connect(track.outputNode);
  }

  loadPluginWithInfo(id: string, instanceId: string, info: PluginInfo, project: Project): Promise<AudioPlugin> {

    return new Promise((resolve, reject) => {
      let plugin: AudioPlugin;

      if (info.id === "drumkit1") plugin = new Drums(id, this.fileService, this.config, info, this.samplesV2Service,this.notes);
      else if (info.id === "metronome") plugin = new MetronomePlugin(this.audioContext.getAudioContext(), this.fileService,
        project, this.config, this.samplesV2Service,this.notes);
      else plugin = new InstrumentSampler(
          id,
          this.notes,
          info,
          (name) => this.samplesV2Service.loadAllInstrumentSamples(name)
        );

      if (instanceId) plugin.setInstanceId(instanceId);
      plugin.load()
        .then(() => resolve(plugin))
        .catch(error => reject(error));
    })


  }


}
