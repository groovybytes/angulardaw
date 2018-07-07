import {Subject} from 'rxjs';
import {TimeSignature} from "../model/theory/TimeSignature";
import {TransportPosition} from "../model/TransportPosition";
import {Injectable} from "@angular/core";
import {AudioContextService} from "./audiocontext.service";
import {logging} from "selenium-webdriver";
import {log} from "util";

@Injectable()
export class TransportService {
  get noteTime(): number {
    return 60 * 1000 / this._bpm;
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

  private _running: boolean = false;

  position: Subject<TransportPosition> = new Subject<TransportPosition>();
  beat: Subject<TransportPosition> = new Subject<TransportPosition>();

  private intervalHandle: any;
  private threshold = 10;
  private _position: TransportPosition = new TransportPosition();

  constructor(private context: AudioContextService) {


  }

  private isMatch(transportTime: number, noteTime: number): boolean {
    return noteTime - transportTime < this.threshold;
  }

  start(): void {

    if (this.intervalHandle) this.stop();
    let startOffset;
    this._position.reset();
    let notesPlayed = 0;
    let timeStamp = 0;
    let offset = 0;
    let firstTrigger = true;
    this.intervalHandle = setInterval(() => {
      requestAnimationFrame(() => {
        if (!startOffset)  startOffset = this.context.context().currentTime;
        this._position.time = this.context.context().currentTime - startOffset;
        offset = (this._position.time - timeStamp) * 1000;

        this._position.bar = Math.floor(notesPlayed / this._signature.barUnit);
        this._position.beat = Math.floor(notesPlayed % this._signature.beatUnit);

        if (firstTrigger || this.isMatch(offset, this.noteTime)) {
          firstTrigger = false;
          offset = 0;
          timeStamp = this._position.time;
          this.beat.next(this._position);
          notesPlayed++;
        }
        this.position.next(this._position);
      })
    }, 0);
    this._running = true;


  }

  pause(): void {

  }

  stop(): void {
    clearInterval(this.intervalHandle);
    this._running = false;
  }


  /* private advance(currentTime: number): void {
     this._position.beat = (this._position.beat % this._signature.beatUnit) + 1;
     if (this._position.beat === 1) this._position.bar++;

     this.position.next(this._position);
   }*/
}
