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


export class Project {
  id: string;
  name: string = "default";
  metronomeEnabled: boolean = true;
  selectedPattern: BehaviorSubject<Pattern> = new BehaviorSubject<Pattern>(null);
  patterns: Array<Pattern> = [];
  matrix: Matrix = new Matrix();
  channel: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  sequencerOpen: boolean = false;
  readonly tracks: Array<Track> = [];
  readonly systemTracks: Array<Track> = [];
  windows: Array<WindowSpecs> = [];
  metronomePattern: Pattern;
  metronomePlugin: WstPlugin;
  ready: boolean = false;
  transportSettings: TransportSettings;
  private transport: Transport;
  trackAdded: EventEmitter<Track> = new EventEmitter();
  trackRemoved: EventEmitter<Track> = new EventEmitter();

  private subscriptions: Array<Subscription> = [];

  constructor(
    private audioContext: AudioContext, transportSettings: TransportSettings) {

    this.transportSettings = transportSettings;
    this.transport = new Transport(this.audioContext, transportSettings);

    this.subscriptions.push(this.channel.subscribe(channel => this.transport.channel = channel));
  }

  getTrack(id: string): Track {
    return this.tracks.find(track => track.id === id);
  }

  isRunning(channels: Array<string>): boolean {
    return channels.indexOf(this.transport.channel) >= 0 && this.transport.isRunning();
  }

  createTransportContext():TransportContext{

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

  start(channel: string, settings: TransportSettings): void {
    this.transport.settings = settings;
    this.transport.channel = channel;
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


