import {Track} from './Track';
import {Matrix} from "./matrix/Matrix";
import {WindowSpecs} from "./visual/WindowSpecs";
import {TimeSignature} from "../mip/TimeSignature";
import {EventEmitter} from "@angular/core";
import {GlobalTransportSettings} from "./transport/GlobalTransportSettings";
import {Pattern} from "./Pattern";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Transport} from "./transport/Transport";
import {TransportSettings} from "./transport/TransportSettings";
import {Subscription} from "rxjs/internal/Subscription";
import {TransportContext} from "./transport/TransportContext";
import {WstPlugin} from "./WstPlugin";
import {PluginInfo} from "./plugins/PluginInfo";


export class Project {
  id: string;
  name: string = "default";
  metronomeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  selectedPattern: BehaviorSubject<Pattern> = new BehaviorSubject<Pattern>(null);
  patterns: Array<Pattern> = [];
  activeSceneRow:number;
  matrix: Matrix = new Matrix();
  sequencerOpen: boolean = false;
  readonly tracks: Array<Track> = [];
  readonly systemTracks: Array<Track> = [];
  windows: Array<WindowSpecs> = [];
  ready: boolean = false;
  transportSettings: TransportSettings;
  private transport: Transport;
  trackAdded: EventEmitter<Track> = new EventEmitter();
  trackRemoved: EventEmitter<Track> = new EventEmitter();
  plugins:Array<PluginInfo>=[];
  colors = ["lightblue", "yellow", "red"];

  private systemChannels=["_metronome"];
  private subscriptions: Array<Subscription> = [];

  constructor(
    private audioContext: AudioContext, transportSettings: TransportSettings) {

    this.transportSettings = transportSettings;
    this.transport = new Transport(this.audioContext, transportSettings);
    this.metronomeEnabled.subscribe(isEnabled=>{
      if (isEnabled) this.addChannel("_metronome");
      else this.removeChannel("_metronome");
    })

  }

  getTrack(id: string): Track {
    return this.tracks.find(track => track.id === id);
  }

  setChannels(channels: Array<string>): void {
    this.transport.channels = channels.concat(this.metronomeEnabled.getValue()?["_metronome"]:[]);
  }

  addChannel(channel: string): void {
    this.transport.channels.push(channel);
  }

  removeChannel(channel: string): void {
    this.transport.channels.splice(this.transport.channels.indexOf(channel), 1);
  }

  isRunningWithChannel(channel: string): boolean {
    return this.transport.isRunning() && this.transport.channels.indexOf(channel)>=0;
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

  stop(): void {
    this.transport.stop();
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
    this.tracks.length = 0;
  }


}


