/*
import {Subject} from 'rxjs';
import {TransportPosition} from "../model/TransportPosition";
import {Injectable} from "@angular/core";
import {AudioContextService} from "./audiocontext.service";
import {logging} from "selenium-webdriver";
import {log} from "util";
import {TimeSignature} from "../model/mip/TimeSignature";
import {SamplesV2Service} from "./samplesV2.service";
import {AppConfiguration} from "../../app.configuration";
import {System} from "../../system/System";
import {Sample} from "../model/Sample";

@Injectable()
export class TransportService {

  private click1: Sample;
  private click2: Sample;

  get noteTime(): number {
    return 60 * 1000 / this._bpm;
  }

  get stepTime(): number {
    return this.noteTime / this.resolution;
  }

  get signature(): TimeSignature {
    return this._signature;
  }

  set signature(value: TimeSignature) {
    let running = this.running;
    this.stop();
    this._signature = value;
    if (running) this.start();
  }

  private _signature: TimeSignature = new TimeSignature(4, 4);

  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = value;
  }

  private _bpm: number = 120;

  get running(): boolean {
    return this._running;
  }

  loop: {
    start: TransportPosition,
    end: TransportPosition
  }

  private _running: boolean = false;

  resolution: number = 1;
  position: Subject<TransportPosition> = new Subject<TransportPosition>();
  beat: Subject<TransportPosition> = new Subject<TransportPosition>();
  step: Subject<TransportPosition> = new Subject<TransportPosition>();

  private intervalHandle: any;
  private threshold = 10;
  private _position: TransportPosition = new TransportPosition(0, 0, 0);
  private pauseTime: number = 0;
  private startOffset: number;
  private paused: boolean = false;
  private _loop: () => void;
  private useTick: boolean = false;


  constructor(private context: AudioContextService,
              private sampleService: SamplesV2Service,
              private config: AppConfiguration) {


  }

  private isMatch(transportTime: number, noteTime: number): boolean {
    return noteTime - transportTime < this.threshold;
  }

  start(): void {
    if (this.paused) {
      this.paused = false;
      this.startOffset += this.context.context().currentTime - this.pauseTime;
      this.intervalHandle = setInterval(() => this._loop(), 1);
    }
    else {
      if (this.intervalHandle) this.stop();
      this._position.reset();
      let notesPlayed = 0;
      let timeStamp = 0;
      let offset = 0;
      let firstTrigger = true;

      this._loop = () => {
        if (this.loop) {
          if (this.loop.end.bar === this._position.bar) {
            this._position.reset();// this.loop.start;
            this.startOffset = this.context.context().currentTime;
            offset = 0;
            timeStamp = 0;
            notesPlayed = 0;
          }
        }

        if (!this.startOffset) this.startOffset = this.context.context().currentTime;
        this._position.time = this.context.context().currentTime - this.startOffset;
        offset = (this._position.time - timeStamp) * 1000;

        this._position.bar = Math.floor(notesPlayed / this._signature.barUnit);
        this._position.beat = Math.floor(notesPlayed % this._signature.beatUnit);

        if (firstTrigger || this.isMatch(offset, this.stepTime)) {
          firstTrigger = false;
          offset = 0;
          timeStamp = this._position.time;
          this.step.next(this._position);
          this._position.step++;

        }
        if (this.isMatch(offset, this.noteTime)) {

          this._position.step = 0;
          this.beat.next(this._position);
          notesPlayed++;
          if (this.useTick) {
            if (this._position.beat === 0) this.click2.trigger();
            else this.click1.trigger();
          }
        }

        this.position.next(this._position);
      };
      this.intervalHandle = setInterval(() => this._loop(), 1);
      this._running = true;
    }
  }

  pause(): void {
    clearInterval(this.intervalHandle);
    this.pauseTime = this.context.context().currentTime;
    this.paused = true;
  }

  stop(): void {
    clearInterval(this.intervalHandle);
    this.pauseTime = 0;
    this.paused = false;
    this.startOffset = null;
    this._running = false;
  }

  turnOnTick(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sampleService.getSamples([
        this.config.getAssetsUrl("sounds/metronome/click1.wav"),
        this.config.getAssetsUrl("sounds/metronome/click2.wav")]).then(result => {
        this.click1 = result[0];
        this.click2 = result[1];
        this.useTick = true;
        resolve();
      }).catch(error => reject(error))
    })

  }


  /!* private advance(currentTime: number): void {
     this._position.beat = (this._position.beat % this._signature.beatUnit) + 1;
     if (this._position.beat === 1) this._position.bar++;

     this.position.next(this._position);
   }*!/
}
*/
