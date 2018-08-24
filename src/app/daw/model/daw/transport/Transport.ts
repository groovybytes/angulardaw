import {Observable, Subject} from "rxjs";
import {EventEmitter} from "@angular/core";
import {TransportPosition} from "./TransportPosition";
import {TransportInterface} from "./TransportInterface";
import {MusicMath} from "../../utils/MusicMath";
import {TimeSignature} from "../../mip/TimeSignature";
import {TransportReader} from "./TransportReader";
import {TransportEvents} from "./TransportEvents";
import {NoteLength} from "../../mip/NoteLength";
import {MasterTransportParams} from "./MasterTransportParams";
import {TransportParams} from "./TransportParams";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";


export class Transport implements TransportInterface,TransportReader,TransportEvents {

  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void> = new EventEmitter<void>();
  transportStart: EventEmitter<void> = new EventEmitter<void>();
  beforeStart: EventEmitter<void> = new EventEmitter<void>();
  timeReset: EventEmitter<number> = new EventEmitter<number>();
  params:TransportParams;
  masterParams:MasterTransportParams;

  private position: TransportPosition;
  private intervalHandle: any;
  private run: boolean = false;
  private tickSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private beatSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private timeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private bpm: number;
  private signature: TimeSignature;


  constructor(
    private audioContext: AudioContext
    ,transportParams:TransportParams,
    masterParams:MasterTransportParams) {

    this.params=transportParams;
    this.masterParams=masterParams;
    this.tickTock = this.tickSubject.asObservable();
    this.beat = this.beatSubject.asObservable();
    this.time = this.timeSubject.asObservable();
    this.position = new TransportPosition();
    this.position.beat = 0;
    this.position.bar = 0;
    this.position.time = 0;
    this.position.tick = 0;
    masterParams.bpm.subscribe(bpm => this.bpm = bpm);
    masterParams.signature.subscribe(signature => this.signature = signature);

  }

  /* getPositionInfo(): TransportPosition {
     return this.position;
   }*/

  private getTickTime(): number {
    return MusicMath.getTickTime(this.bpm, this.params.quantization.getValue());
  }

  private getBeatTime(): number {
    return MusicMath.getBeatTime(this.bpm, this.params.quantization.getValue());
  }

  getStartTime(): number {
    return this.params.loopStart.getValue() * this.getBeatTime();
  }

  getEndTime(): number {
    return this.params.loopEnd.getValue() * this.getBeatTime();
  }

  start(): void {

    let start = this.audioContext.currentTime;
    this.beforeStart.emit();
    this.run = true;
    this.timeReset.emit();

    this.intervalHandle = setInterval(() => {
      let currentTime = this.audioContext.currentTime - start;
      if (currentTime > this.getEndTime() / 1000) {

        if (this.params.loop.getValue()) {
          start = this.audioContext.currentTime;
        }
        else {
          this.run = false;
          this.transportEnd.emit();
        }

      }
      else this.timeSubject.next(currentTime);
    }, 1)

  }

  destroy(): void {
    this.stop();
    //this.timeSubscription.unsubscribe();
    if (this.intervalHandle) clearInterval(this.intervalHandle);
  }

  pause(): void {

  }

  stop(): void {

    this.run = false;
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.transportEnd.emit();
  }

  isRunning(): boolean {
    return this.run;
  }

  getBeat(): number {
    return this.beatSubject.getValue();
  }

  getBpm(): number {
    return this.bpm;
  }

  getLoopEnd(): number {
    return this.params.loopEnd.getValue();
  }

  getLoopStart(): number {
    return this.params.loopStart.getValue();
  }

  getQuantization(): NoteLength {
    return this.params.quantization.getValue();
  }

  getSignature(): TimeSignature {
    return this.signature;
  }

  getTick(): number {
    return this.tickSubject.getValue();
  }

  getTime(): number {
    return this.timeSubject.getValue();
  }

  isLoop(): boolean {
    return this.params.loop.getValue();
  }



}
