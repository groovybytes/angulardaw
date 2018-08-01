import {MusicMath} from "../utils/MusicMath";
import {Subject} from "rxjs/index";
import {Observable} from "rxjs/internal/Observable";
import {TransportPosition} from "./TransportPosition";
import {EventEmitter} from "@angular/core";
import {TransportParams} from "./TransportParams";

declare var _;

export class Transport {
  get running(): boolean {
    return this.intervalHandle && this.intervalHandle >= 0;
  }

  params:TransportParams;
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void> = new EventEmitter<void>();
  transportStart: EventEmitter<void> = new EventEmitter<void>();
  private position: TransportPosition;
  private paused: boolean = false;
  private transportStartTime: number = 0;
  private intervalHandle: any;
  private pauseTime: number = 0;
  private accuracy = 0.03; //10ms
  private tickSubject: Subject<number> = new Subject<number>();
  private beatSubject: Subject<number> = new Subject<number>();
  private timeSubject: Subject<number> = new Subject<number>();
  private tick: number;

  //private timeSubscription: Subscription;


  constructor(private getTime: () => number) {
    this.tickTock = this.tickSubject.asObservable();
    this.beat = this.beatSubject.asObservable();
    this.time = this.timeSubject.asObservable();
    this.position = new TransportPosition();
    this.position.beat = 0;
    this.position.bar = 0;
    this.position.time = 0;
    this.position.tick = 0;

  }

  private matches(val1: number, val2: number, accuracy: number): boolean {
    return Math.abs(val2 - val1) < accuracy;
  }

  getPositionInfo(): TransportPosition {
    return this.position;
  }

  start(): void {
    this.stop();
    this.transportStart.emit();
    if (this.paused) {
      this.paused = false;
      //this.transportStartTime += this.scheduler.getSysTime() - this.pauseTime;

    }
    else {
      let prevQuantizationMatch = 0;
      let quantizationDelta = 0;
      let lastBeat = -1;
      let intervalTime: number = -1;
      let resetTime: boolean = true;
      this.tick = this.params.tickStart;
      this.intervalHandle = setInterval(
        () => {

          let sysTime = this.getTime();
          if (sysTime > intervalTime) {
            intervalTime = sysTime;

            if (resetTime) {
              this.transportStartTime = sysTime;
              resetTime = false;
            }
            let transportTime = sysTime - this.transportStartTime;
            quantizationDelta = (transportTime - prevQuantizationMatch);

            this.position.time = transportTime;
            this.timeSubject.next(transportTime);


            if ((transportTime === 0) || this.matches(
              quantizationDelta,
              MusicMath.getTickTime(this.params.bpm, this.params.quantization) / 1000,
              this.accuracy)) {
              quantizationDelta = 0;
              prevQuantizationMatch = transportTime;
              this.position.tick = this.tick;

              if (this.tick <= this.params.tickEnd) {
                this.tickSubject.next(this.tick);
                let newBeat = MusicMath.getBeatNumber(this.tick, this.params.quantization, this.params.signature);
                this.beatSubject.next(newBeat);
                this.position.beat = newBeat;
                this.position.bar = MusicMath.getBarNumber(this.tick, this.params.quantization, this.params.signature);
                this.tick += 1;
              }
              else {
                if (this.params.loop) {
                  this.tick = this.params.tickStart;
                  resetTime = true;
                  quantizationDelta = 0;
                  prevQuantizationMatch = 0;
                  lastBeat = -1;
                  intervalTime = -1;
                  // this.position.bar = MusicMath.getBarNumber(this.tick, this.quantization, this.signature);
                }
                else {
                  this.stop();
                }
              }
            }

          }
        }, 0);
    }
  }


  destroy(): void {
    this.stop();
    //this.timeSubscription.unsubscribe();
    if (this.intervalHandle) clearInterval(this.intervalHandle);
  }

  pause(): void {
    this.pauseTime = this.getTime();
    this.paused = true;
  }

  stop(): void {
    this.pauseTime = 0;
    this.paused = false;
    this.transportStartTime = null;
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.transportEnd.emit();
  }
}