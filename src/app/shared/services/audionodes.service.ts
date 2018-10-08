import {Inject, Injectable} from "@angular/core";
import {VirtualAudioNode} from "../model/daw/VirtualAudioNode";
import {AudioNodeDto} from "../model/daw/dto/AudioNodeDto";
import {AudioNodeTypes} from "../model/daw/AudioNodeTypes";
import {AudioContextService} from "./audiocontext.service";


@Injectable()
export class AudioNodesService {

  constructor(private audioContext: AudioContextService) {

  }


  convertNodesFromJson(jsonNodes: Array<AudioNodeDto>, routes: Array<{ source: string, target: string }>): Array<VirtualAudioNode<AudioNode>> {
    let nodes: Array<VirtualAudioNode<AudioNode>> = [];
    jsonNodes.forEach(jsonNode => {
      let node = this.createVirtualNode(jsonNode.id,jsonNode.nodeType,jsonNode.meta);

      nodes.push(node);
    });

    routes.forEach(route => {
      let sourceNode = nodes.find(n => n.id === route.source);
      let targetNode = nodes.find(n => n.id === route.target);
      sourceNode.connect(targetNode);
    });

    return nodes;

  }

  convertNodeToJson(node: VirtualAudioNode<any>): AudioNodeDto {
    let dto = new AudioNodeDto();
    dto.id = node.id;
    dto.nodeType = this.getNodeType(node.node);
    dto.status = null;
    dto.meta=node.meta;

    return dto;
  }

  getRoutes(node: VirtualAudioNode<AudioNode>): Array<{ source: string, target: string }> {
    let routes: Array<{ source: string, target: string }> = [];
    this.createRoutes(node, routes);
    return routes;
  }

  getNodeType(node: AudioNode): AudioNodeTypes {
    if (node instanceof GainNode) return AudioNodeTypes.GAIN;
    else if (node instanceof PannerNode) return AudioNodeTypes.PANNER;
    else if (node instanceof AudioDestinationNode) return AudioNodeTypes.DESTINATION;

    throw "unknown node type";
  }

  createVirtualNode(id:string,type: AudioNodeTypes,meta:string): VirtualAudioNode<AudioNode> {
    return new VirtualAudioNode(id,this.createNode(type),meta);
  }

  private createNode(type: AudioNodeTypes): AudioNode {
    if (type === AudioNodeTypes.PANNER) return this.audioContext.getAudioContext().createPanner();
    else if (type === AudioNodeTypes.GAIN) return this.audioContext.getAudioContext().createGain();
    else if (type === AudioNodeTypes.DESTINATION) return this.audioContext.getAudioContext().destination;

    throw "unknown node type";
  }

  private createRoutes(node: VirtualAudioNode<any>, routes: Array<{ source: string, target: string }>): void {
    node.sources.forEach(source => {
      routes.push({source: source.id, target: node.id});
      this.createRoutes(source, routes);
    });

  }


}
