import {EventEmitter, Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {VirtualAudioNode} from "../../model/daw/VirtualAudioNode";
import {TrackDto} from "../../model/daw/dto/TrackDto";
import {PluginDto} from "../../model/daw/dto/PluginDto";
import {TrackControlParametersDto} from "../../model/daw/dto/TrackControlParametersDto";
import * as _ from "lodash";
import {AudioNodesService} from "./audionodes.service";
import {AudioNodeTypes} from "../../model/daw/AudioNodeTypes";
import {TrackCategory} from "../../model/daw/TrackCategory";
import {AudioContextService} from "./audiocontext.service";
import {PluginInfo} from "../../model/daw/plugins/PluginInfo";
import {PluginsService} from "./plugins.service";
import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";


@Injectable()
export class TracksService {

  constructor(
    private audioContext: AudioContextService,
    private audioNodesService: AudioNodesService,
    private pluginService: PluginsService
  ) {

  }


  createTrack(nodes: Array<VirtualAudioNode<AudioNode>>, deviceEvents: EventEmitter<DeviceEvent<any>>, category: TrackCategory, masterIn: VirtualAudioNode<AudioNode>, hint?: string): Track {
    let trackId = _.uniqueId("track-" + (hint ? hint : ""));
    let inputNode = <VirtualAudioNode<PannerNode>>this.audioNodesService.createVirtualNode(_.uniqueId("node-"), AudioNodeTypes.PANNER, "track: " + trackId);
    let outputNode = <VirtualAudioNode<GainNode>>this.audioNodesService.createVirtualNode(_.uniqueId("node-"), AudioNodeTypes.GAIN, "track: " + trackId);

    let track = new Track(trackId, deviceEvents,inputNode, outputNode, this.audioContext.getAudioContext());

    nodes.push(track.inputNode);
    nodes.push(track.outputNode);

    if (category === TrackCategory.DEFAULT || category === TrackCategory.SYSTEM) track.outputNode.connect(masterIn);
    else {
      track.inputNode.connect(track.outputNode);
      track.outputNode.node.connect(this.audioContext.getAudioContext().destination);
    }

    track.category = category;
    track.name = "default-name";
    track.color = "red";

    return track;
  }


  addTrackWithPlugin(plugin: PluginInfo, project: Project): Promise<Track> {

    return new Promise((resolve, reject) => {
      let track: Track = this.createTrack(project.nodes, project.deviceEvents,TrackCategory.DEFAULT, project.getMasterBus().inputNode);
      project.tracks.push(track);
      let pluginInfo = project.pluginTypes.find(p => p.id === plugin.id);
      this.pluginService.loadPluginWithInfo(_.uniqueId("instrument-"), pluginInfo, project)
        .then(plugin => {
          track.plugins = [plugin];
          this.pluginService.setupInstrumentRoutes(project, track, plugin);

          //this.layout.addWindow(plugin.getId());
          project.plugins.push(plugin);
          track.name = pluginInfo.name;
          resolve(track);
        })
        .catch(error => reject(error));
    })
  }

  convertTrackFromJson(trackDto: TrackDto,deviceEvents: EventEmitter<DeviceEvent<any>>, nodes: Array<VirtualAudioNode<AudioNode>>): Track {
    let inputNode = <VirtualAudioNode<PannerNode>>nodes.find(n => n.id === trackDto.inputNode);
    let outputNode = <VirtualAudioNode<GainNode>>nodes.find(n => n.id === trackDto.outputNode);
    let track = new Track(trackDto.id, deviceEvents,inputNode, outputNode, this.audioContext.getAudioContext());

    track.category = trackDto.category;
    track.name = trackDto.name;
    track.color = trackDto.color;
    track.controlParameters.gain.next(trackDto.controlParameters.gain ? trackDto.controlParameters.gain : 100);
    track.controlParameters.mute.next(trackDto.controlParameters.mute ? trackDto.controlParameters.mute : false);
    track.controlParameters.solo.next(trackDto.controlParameters.solo ? trackDto.controlParameters.solo : false);
    track.controlParameters.record.next(trackDto.controlParameters.record ? trackDto.controlParameters.record : false);
    return track;
  }

  convertTrackToJson(track: Track): TrackDto {
    let trackDto = new TrackDto();
    trackDto.id = track.id;
    trackDto.name = track.name;
    trackDto.color = track.color;
    trackDto.category = track.category;
    trackDto.plugins = [];
    trackDto.inputNode = track.inputNode.id;
    trackDto.outputNode = track.outputNode.id;
    track.plugins.forEach(p => {
      let dto = new PluginDto();
      dto.id = p.getId();
      dto.pluginTypeId = p.getInfo().id;
      dto.inputNode = p.getInputNode().id;
      dto.outputNode = p.getOutputNode().id;
      dto.pad = p.getInfo().pad;
      trackDto.plugins.push(dto);
    });
    trackDto.controlParameters = new TrackControlParametersDto();
    trackDto.controlParameters.gain = track.controlParameters.gain.getValue();
    trackDto.controlParameters.mute = track.controlParameters.mute.getValue();
    trackDto.controlParameters.solo = track.controlParameters.solo.getValue();
    trackDto.controlParameters.record = track.controlParameters.record.getValue();

    return trackDto;
  }

  /*createTrack(category:TrackCategory,id?:string): Track {
    let track = new Track(id?id:_.uniqueId("track-"),this.audioContext);
    track.inputNode = new VirtualAudioNode<PannerNode>(new PannerNode());
    track.outputNode = new VirtualAudioNode<GainNode>(this.audioContext.createGain());
    project.nodes.push(track.inputNode);
    project.nodes.push(track.outputNode);
    track.inputNode.connect(track.outputNode);
    if (category===TrackCategory.DEFAULT) track.outputNode.connect(project.getMasterBus().inputNode);
    else track.outputNode.node.connect(this.audioContext.destination);
    project.tracks.push(track);
    return track;
  }*/

  toggleSolo(project: Project, track: Track): void {
    track.controlParameters.solo.next(!track.controlParameters.solo.getValue());
    let isSolo = track.controlParameters.solo.getValue();
    if (isSolo) track.controlParameters.mute.next(false);
    project.tracks.forEach(_track => {
      if (_track.id !== track.id) {
        if (_track.controlParameters.solo.getValue() === true) _track.controlParameters.solo.next(false);
        _track.controlParameters.mute.next(isSolo);
      }
    });
  }


}
