import {Injectable} from "@angular/core";
import {WstPlugin} from "../../model/daw/plugins/WstPlugin";
import {FilesApi} from "../api/files.api";
import {SamplesApi} from "../api/samples.api";
import {TheoryService} from "./theory.service";
import {System} from "../../../system/System";
import {AppConfiguration} from "../../../app.configuration";
import {PluginInfo} from "../../model/daw/plugins/PluginInfo";
import {GenericInstrumentSampler} from "../../model/daw/plugins/GenericInstrumentSampler";
import {Drums} from "../../model/daw/plugins/Drums";
import * as _ from "lodash";
import {Track} from "../../model/daw/Track";
import {AudioNodeTypes} from "../../model/daw/AudioNodeTypes";
import {AudioNodesService} from "./audionodes.service";
import {Project} from "../../model/daw/Project";

@Injectable()
export class PluginsService {

  constructor(
    private fileService: FilesApi,
    private system: System,
    private config: AppConfiguration,
    private theoryService: TheoryService,
    private nodesService:AudioNodesService,
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

  setupInstrumentRoutes(project:Project,track:Track,plugin:WstPlugin):void{
    let meta = "plugin_"+plugin.getInfo().name;
    plugin.inputNode=this.nodesService.createVirtualNode(_.uniqueId("node-"),AudioNodeTypes.PANNER,meta);
    plugin.outputNode=this.nodesService.createVirtualNode(_.uniqueId("node-"),AudioNodeTypes.GAIN,meta);

    project.nodes.push(plugin.inputNode);
    project.nodes.push(plugin.outputNode);
    track.inputNode.connect(plugin.inputNode);
    plugin.inputNode.connect(plugin.outputNode);
    plugin.outputNode.connect(track.outputNode);
  }
  loadPluginWithInfo(info:PluginInfo): Promise<WstPlugin> {

    let plugin: WstPlugin;

    if (info.id==="drumkit1") plugin = new Drums(_.uniqueId("instrument-"),this.fileService, this.config,info, this.samplesV2Service);
    else plugin = new GenericInstrumentSampler(_.uniqueId("instrument-"),info, this.theoryService, this.fileService, this.config, this.samplesV2Service);

    return plugin.load();

  }


}
