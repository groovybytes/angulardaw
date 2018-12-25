import {Sample} from "../Sample";
import {Project} from "../Project";
import {AppConfiguration} from "../../../app.configuration";
import {NoteEvent} from "../../mip/NoteEvent";
import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {FilesApi} from "../../../api/files.api";
import {SamplesApi} from "../../../api/samples.api";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {AudioPlugin} from "./AudioPlugin";
import {EventEmitter} from "@angular/core";
import {DeviceEvent} from "../devices/DeviceEvent";
import {SampleEventInfo} from "../SampleEventInfo";


export class MetronomePlugin extends AudioPlugin {

  private inputNode: VirtualAudioNode<AudioNode>;
  private outputNode: VirtualAudioNode<AudioNode>;

  private lastBeat: number = -1;
  private accentSample: Sample;
  private otherSample: Sample;

  checked: boolean = true;

  constructor(
    private audioContext: AudioContext,
    private fileService: FilesApi,
    private project: Project,
    private config: AppConfiguration,
    private samplesV2Service: SamplesApi) {
    super();
    /* let track = this.tracksService.createDefaultTrack(this.project.transport.masterParams);
     let tickTime =
       MusicMath.getTickTime(track.transport.getBpm(),
         track.transport.getQuantization());
     let beatTicks = MusicMath.getBeatTicks( track.transport.getQuantization());
     let beatTime = tickTime * beatTicks;

     for (let i = 0; i < 100; i++) {
       track.events.push(new NoteTrigger(null, "",i*beatTime));
     }

     track.plugin=this;*/

    /*   this.streamer = new NoteStream([], this.transportService.getEvents(), this.transportService.getInfo());
       this.subscriptions.push(this.streamer.trigger.subscribe(event => this.onNextEvent(event.offset, event.event)));

       this.transportSubscription = transportService.tickTock.subscribe(tick => {
         // this.feed(this.transportService.getPositionInfo())
       });*/
  }


  destroy(): void {
   this.accentSample.destroy();
   this.otherSample.destroy();
  }


  /* feed(position: TransportPosition): void {
     /!*if (position.beat !== this.lastBeat) {
       if (position.beat === 0) this.accentSample.trigger(0);
       else this.otherSample.trigger(0);
     }*!/

   }*/

  /*
    isChecked(): boolean {
      return this.project.metronomeEnabled;
    }
  */

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.samplesV2Service.getClickSamples().then(result => {
        this.accentSample = result.accentSample;
        this.otherSample = result.defaultSample;
        resolve();
      })
        .catch(error => reject(error));
    })
  }

  getSample(note:string): Sample {

    if (note === "A0") return this.accentSample;
    else return this.otherSample;

   /* return new Promise<void>(((resolve, reject) => {
      if (this.project.metronomeEnabled) {
        if (event.note === "A0") this.accentSample.trigger(event);//trigger(offset);
        else this.otherSample.trigger(event);
      }
    }))*/


  }

  getId(): string {
    return "metronome";
  }

  getNotes(): Array<string> {
    return [];
  }

  getInfo(): PluginInfo {
    let info= new PluginInfo();
    info.id="metronome";
    return info;
  }

  getInputNode(): VirtualAudioNode<AudioNode> {
    return this.inputNode;
  }

  getOutputNode(): VirtualAudioNode<AudioNode> {
    return this.outputNode;
  }

  setInputNode(node: VirtualAudioNode<AudioNode>): void {
    this.inputNode=node;
  }

  setOutputNode(node: VirtualAudioNode<AudioNode>): void {
    this.outputNode=node;
    this.accentSample.setDestination(node.node);
    this.otherSample.setDestination(node.node);
  }

  getInstrumentCategory(): InstrumentCategory {
    return InstrumentCategory.OTHER;
  }

 /* stop(): void {

    this.accentSample.stop();
    this.otherSample.stop();
  }*/
}
