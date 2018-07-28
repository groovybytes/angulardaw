import {MusicMath} from "../utils/MusicMath";
import {TimeSignature} from "../mip/TimeSignature";
import {Subject} from "rxjs/index";
import {Observable} from "rxjs/internal/Observable";
import {TransportPosition} from "./TransportPosition";
import {NoteLength} from "../mip/NoteLength";
import {EventEmitter} from "@angular/core";
import {TrackEvent} from "./TrackEvent";

declare var _;

export class Transport {
  get running(): boolean {
    return this.intervalHandle && this.intervalHandle >= 0;
  }

  loop: boolean = false;
  bpm: number;
  quantization: NoteLength = NoteLength.Quarter;
  signature: TimeSignature = new TimeSignature(4, 4);
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  trackEvent: Observable<Array<TrackEvent<any>>>;
  transportEnd: EventEmitter<void> = new EventEmitter<void>();
  transportStart: EventEmitter<void> = new EventEmitter<void>();
  tickStart: number = 0;
  tickEnd: number = Number.MAX_VALUE;
  private trackEventIndex: number = 0;
  private position: TransportPosition;
  private trackEvents: Array<TrackEvent<any>> = [];
  private paused: boolean = false;
  private transportStartTime: number = 0;
  private intervalHandle: any;
  private pauseTime: number = 0;
  private accuracy = 0.03; //10ms
  private tickSubject: Subject<number> = new Subject<number>();
  private beatSubject: Subject<number> = new Subject<number>();
  private timeSubject: Subject<number> = new Subject<number>();
  private trackSubject: Subject<Array<TrackEvent<any>>> = new Subject<Array<TrackEvent<any>>>();
  private tick: number;

  //private timeSubscription: Subscription;


  constructor(private getTime: () => number, bpm: number) {
    this.tickTock = this.tickSubject.asObservable();
    this.beat = this.beatSubject.asObservable();
    this.time = this.timeSubject.asObservable();
    this.trackEvent = this.trackSubject.asObservable();
    this.position = new TransportPosition();
    this.position.beat = 0;
    this.position.bar = 0;
    this.position.time = 0;
    this.position.tick = 0;
    this.bpm = bpm;

  }

  private matches(val1: number, val2: number, accuracy: number): boolean {
    return Math.abs(val2 - val1) < accuracy;
  }

  private isEventMatch(transportTime: number, noteTime: number): boolean {
    let diff = transportTime - noteTime / 1000;
    return diff === 0 || Math.abs(diff) <= 0.01;
  }

  /*private isMatch(transportTime: number, noteTime: number): boolean {
    let diff = transportTime - noteTime / 1000;
    return diff === 0 || Math.abs(diff) <= this.accuracy;
  }*/

  getPositionInfo(): TransportPosition {
    return this.position;
  }

  setTrackEvents(events: Array<TrackEvent<any>>): void {
    this.trackEvents = _.clone(events);
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
      this.tick = this.tickStart;
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
              MusicMath.getTickTime(this.bpm, this.quantization) / 1000,
              this.accuracy)) {
              quantizationDelta = 0;
              prevQuantizationMatch = transportTime;
              this.position.tick = this.tick;

              if (this.tick <= this.tickEnd) {
                this.tickSubject.next(this.tick);
                let newBeat = MusicMath.getBeatNumber(this.tick, this.quantization, this.signature);
                this.beatSubject.next(newBeat);
                this.position.beat = newBeat;
                this.position.bar = MusicMath.getBarNumber(this.tick, this.quantization, this.signature);
                this.tick += 1;
              }
              else {
                if (this.loop) {
                  this.tick = this.tickStart;
                  resetTime = true;
                  quantizationDelta = 0;
                  prevQuantizationMatch = 0;
                  lastBeat = -1;
                  intervalTime = -1;
                  this.trackEventIndex = 0;
                  // this.position.bar = MusicMath.getBarNumber(this.tick, this.quantization, this.signature);
                }
                else {
                  this.stop();
                }
              }
            }
            if (this.trackEvents.length > 0 && this.trackEventIndex < this.trackEvents.length) {
              let matches = 0;
              for (let i = this.trackEventIndex; i < this.trackEvents.length; i++) {
                //subtract 100 for the sample trigger
                if (this.trackEvents[i].time===0 || this.matches(transportTime, (this.trackEvents[i].time) / 1000, this.accuracy)) {
                  matches++;
                  this.trackSubject.next([this.trackEvents[i]]);
                }
              }
              this.trackEventIndex += matches;
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
    this.trackEventIndex = 0;
    this.transportStartTime = null;
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.transportEnd.emit();
  }
}
