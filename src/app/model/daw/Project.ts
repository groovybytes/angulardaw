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
import {RecordSession} from "./RecordSession";
import {Thread} from "./Thread";
import {DawEvent} from "./DawEvent";
import {TransportSession} from "./session/TransportSession";
import {filter} from "rxjs/operators";
import {DawEventCategory} from "./DawEventCategory";
import {Metronome} from "./Metronome";
import {TimeSignature} from "../mip/TimeSignature";


export class Project {
  id: string;
  name: string = "default";
  events: EventEmitter<DawEvent<any>> = new EventEmitter();
  session: TransportSession;
  selectedPattern: BehaviorSubject<Pattern> = new BehaviorSubject<Pattern>(null);
  selectedTrack: BehaviorSubject<Track> = new BehaviorSubject<Track>(null);
  patterns: Array<Pattern> = [];
  activeSceneRow: number;
  matrix: Matrix = new Matrix();

  nodes: Array<VirtualAudioNode<AudioNode>>;
  readonly tracks: Array<Track> = [];

  settings: ProjectSettings = new ProjectSettings();
  trackAdded: EventEmitter<Track> = new EventEmitter();
  trackRemoved: EventEmitter<Track> = new EventEmitter();
  pluginTypes: Array<PluginInfo> = [];
  plugins: Array<AudioPlugin> = [];
  metronome: Metronome;
  activePlugin: BehaviorSubject<AudioPlugin> = new BehaviorSubject(null);
  colors = ["lightblue", "yellow", "red"];
  recordSession: RecordSession=new RecordSession();
  //metronomePattern: Pattern;
  pushSettings: Array<PushSettings>;
  pushKeyBindings: KeyBindings;
  readonly deviceEvents2: EventEmitter<DeviceEvent<any>> = new EventEmitter();
  readonly channels:Array<string>=[];

  threads: Array<Thread> = [];

  constructor(
    private audioContext: AudioContextService) {


    this.settings.metronomeSettings.enabled.subscribe(isEnabled => {
      if (isEnabled) this.addChannel("_metronome");
      else this.removeChannel("_metronome");
    })

  }

  subscribe(categories: Array<DawEventCategory>, callback: (event: DawEvent<any>) => void): Subscription {
    return this.events.pipe(filter((event => categories.indexOf(event.category) >= 0))).subscribe(event => callback(event));
  }

  createTransport(): void {

  }

  getTrack(id: string): Track {
    return this.tracks.find(track => track.id === id);
  }

  getPlugin(id: string): AudioPlugin {
    let result = this.plugins.find(pl => pl.getId() === id);
    return result;
  }

  setChannels(channels: Array<string>): void {
    this.channels.length = 0;
    channels.forEach(channel =>
      this.addChannel(channel));
  }

  addChannel(channel: string): void {
    this.channels.push(channel);
  }

  removeChannel(channel: string): void {
    this.channels.splice(this.channels.indexOf(channel), 1);
  }

  isRunningWithChannel(channel: string): boolean {
    return this.channels.indexOf(channel) >= 0;
  }

  destroy(): void {
    //todo emit daw destroy?
    this.nodes.forEach(node => node.destroy());
    this.nodes.length = 0;
    this.plugins.forEach(plugin => plugin.destroy());
    this.tracks.forEach(track => track.destroy());
    this.tracks.length = 0;
    this.audioContext.getAudioContext().destination.disconnect();
    this.threads.forEach(t => t.destroy());
  }

  getMasterBus(): Track {
    return this.tracks.find(t => t.category === TrackCategory.BUS);
  }

  getCountIn():number{
    return (this.settings.metronomeSettings.enabled.getValue()&&this.recordSession.state.getValue()!==0)
      ?this.settings.signature.beatUnit*this.settings.metronomeSettings.countInBars:0;
  }

}



