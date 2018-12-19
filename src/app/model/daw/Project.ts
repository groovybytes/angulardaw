import {Track} from './Track';
import {Matrix} from "./matrix/Matrix";
import {EventEmitter} from "@angular/core";
import {Pattern} from "./Pattern";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Transport} from "./transport/Transport";
import {TransportSettings} from "./transport/TransportSettings";
import {Subscription} from "rxjs/internal/Subscription";
import {TransportContext} from "./transport/TransportContext";
import {PluginInfo} from "./plugins/PluginInfo";
import {ProjectSettings} from "./ProjectSettings";
import {VirtualAudioNode} from "./VirtualAudioNode";
import {TrackCategory} from "./TrackCategory";
import {AudioContextService} from "../../shared/services/audiocontext.service";
import {DeviceEvent} from "./devices/DeviceEvent";
import {AudioPlugin} from "./plugins/AudioPlugin";
import {PushSettings} from "../../push/model/PushSettings";
import {KeyBindings} from "../../push/model/KeyBindings";


export class Project {
  id: string;
  name: string = "default";
  metronomeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  selectedPattern: BehaviorSubject<Pattern> = new BehaviorSubject<Pattern>(null);
  selectedTrack: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);
  patterns: Array<Pattern> = [];
  activeSceneRow: number;
  matrix: Matrix = new Matrix();
/*  openedWindows: Array<string>;*/
  nodes: Array<VirtualAudioNode<AudioNode>>;
  readonly tracks: Array<Track> = [];
  ready: boolean = false;
  transportSettings: TransportSettings;
  settings: ProjectSettings = new ProjectSettings();
  readonly transport: Transport;
  trackAdded: EventEmitter<Track> = new EventEmitter();
  trackRemoved: EventEmitter<Track> = new EventEmitter();
  pluginTypes: Array<PluginInfo> = [];
  plugins: Array<AudioPlugin> = [];
  colors = ["lightblue", "yellow", "red"];
  record: EventEmitter<Pattern> = new EventEmitter<Pattern>();
  /*recordNoteStart: EventEmitter<NoteEvent> = new EventEmitter<NoteEvent>();
  recordNoteEnd: EventEmitter<void> = new EventEmitter<void>();*/
  metronomePattern: Pattern;
  pushSettings:PushSettings;
  pushKeyBindings:KeyBindings;
  readonly deviceEvents:EventEmitter<DeviceEvent<any> >=new EventEmitter();

  private subscriptions: Array<Subscription> = [];

  constructor(
    private audioContext: AudioContextService, transportSettings: TransportSettings) {

    this.transportSettings = transportSettings;
    this.transport = new Transport(this.audioContext.getAudioContext(), transportSettings);
    this.metronomeEnabled.subscribe(isEnabled => {
      if (isEnabled) this.addChannel("_metronome");
      else this.removeChannel("_metronome");
    })

  }

  getTrack(id: string): Track {
    return this.tracks.find(track => track.id === id);
  }

  getPlugin(id: string): AudioPlugin {
    let result = this.plugins.find(pl => pl.getId() === id);
    return result;
  }

  setChannels(channels: Array<string>): void {
    this.transport.channels = channels.concat(this.metronomeEnabled.getValue() ? ["_metronome"] : []);
  }

  addChannel(channel: string): void {
    this.transport.channels.push(channel);
  }

  removeChannel(channel: string): void {
    this.transport.channels.splice(this.transport.channels.indexOf(channel), 1);
  }

  isRunningWithChannel(channel: string): boolean {
    return this.transport.isRunning() && this.transport.channels.indexOf(channel) >= 0;
  }

  createTransportContext(): TransportContext {

    let transportSettings = new TransportSettings();
    transportSettings.loop = true;
    transportSettings.loopStart = 0;
    transportSettings.loopEnd = 8;
    transportSettings.global = this.transportSettings.global;
    let transportContext = new TransportContext();
    transportContext.settings = transportSettings;
    transportContext.time = this.transport.time;
    transportContext.transportEnd = this.transport.transportEnd;
    transportContext.transportStart = this.transport.transportStart;
    transportContext.beforeStart = this.transport.beforeStart;

    return transportContext;
  }


  start(): void {
    if (this.transport.isRunning()) this.transport.stop();
    this.transport.start();
  }

  startRecord(): void {

  }

  stop(): void {
    this.transport.stop();
  }

  destroy(): void {
    this.transport.stop();
    this.nodes.forEach(node => node.destroy());
    this.nodes.length=0;
    this.plugins.forEach(plugin => plugin.destroy());
    this.tracks.forEach(track => track.destroy());
    this.tracks.length = 0;
    this.audioContext.getAudioContext().destination.disconnect();
    //return this.audioContext.destroy();
  }

  getMasterBus(): Track {
    return this.tracks.find(t => t.category === TrackCategory.BUS);
  }


}


