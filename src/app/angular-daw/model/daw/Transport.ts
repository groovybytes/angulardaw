import {Scheduler} from "./Scheduler";
import {MusicMath} from "../utils/MusicMath";
import {TimeSignature} from "../mip/TimeSignature";
import {BehaviorSubject, Subject, Subscription} from "rxjs/index";
import {Observable} from "rxjs/internal/Observable";
import {TransportPosition} from "./TransportPosition";
import {NoteLength} from "../mip/NoteLength";
import {EventEmitter} from "@angular/core";

export class Transport {
  get running(): boolean {
    return this.looper;
  }

  loop: boolean = false;
  bpm: number;
  quantization: NoteLength = NoteLength.Quarter;
  signature: TimeSignature = new TimeSignature(4, 4);
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void> = new EventEmitter<void>();
  transportStart: EventEmitter<void> = new EventEmitter<void>();
  tickStart: number = 0;
  tickEnd: number = Number.MAX_VALUE;
  private position: TransportPosition;
  private paused: boolean = false;
  private looper:boolean=false;
  private startOffset: number = 0;
  private intervalHandle: any;
  private pauseTime: number = 0;
  private threshold = 10;
  private _loop: () => void;
  private tickSubject: Subject<number> = new Subject<number>();
  private beatSubject: Subject<number> = new Subject<number>();
  private timeSubject: Subject<number> = new Subject<number>();
  private tick: number;
  //private timeSubscription: Subscription;


  constructor(private scheduler: Scheduler, bpm: number) {
    this.tickTock = this.tickSubject.asObservable();
    this.beat = this.beatSubject.asObservable();
    this.time = this.timeSubject.asObservable();
    this.position = new TransportPosition();
    this.position.beat = 0;
    this.position.bar = 0;
    this.position.time = 0;
    this.position.tick = 0;
    this.bpm = bpm;

    //this.timeSubscription = this.scheduler.time.subscribe(time => this.onTime(time));

  }

  private onTick(tick: number): void {
    /*console.log(tick);
    this.position.tick = tick;
    this.position.beat = MusicMath.getBeatNumber(tick,this.quantization,this.signature);
    this.position.bar =  MusicMath.getBarNumber(tick,this.quantization,this.signature);
    if (this.lastBeat !== this.position.beat) {
      this.beatSubject.next(this.position.beat);
      this.lastBeat = this.position.beat;
    }
    this.tickSubject.next(this.position.tick);*/
  }

  private onTime(time: number): void {
    this.position.time = time;
    this.timeSubject.next(this.position.time);
  }

  /*  private onLoopChanged(): void {
      /!*  this.tickStart = this.loopStart * this.signature.beatUnit;
        this.project.transport.tickEnd = startTick + this.project.signature.beatUnit * this.loopLength;*!/
    }*/

  private isMatch(transportTime: number, noteTime: number): boolean {
    return noteTime - transportTime < this.threshold;
  }

  getPositionInfo(): TransportPosition {
    return this.position;
  }

  private onSchedulerTime(time: number): void {

  }

  start(): void {
    this.scheduler.stop();
    this.transportStart.emit();
    this.scheduler.start();
    this.looper=true;
    if (this.paused) {
      this.paused = false;
      this.startOffset += this.scheduler.getSysTime() - this.pauseTime;

    }
    else {
      let timeStamp = 0;
      let offset = 0;
      let firstTrigger = true;
      let lastBeat = -1;
      this.tick = this.tickStart;

      this._loop = () => {
        if (this.looper){
          if (this.tick > this.tickEnd) {
            if (this.loop) {
              this.tick = this.tickStart;
              this.startOffset = this.scheduler.getSysTime();
              offset = 0;
              timeStamp = 0;
              lastBeat = -1;
            }
            else {
              this.looper = false;
              this.transportEnd.emit();
            }
          }
          if (this.looper) {
            if (!this.startOffset) this.startOffset = this.scheduler.getSysTime();
            let newTime = this.scheduler.getSysTime() - this.startOffset;
            offset = (newTime - timeStamp) * 1000;

            this.position.time=newTime;
            this.timeSubject.next(newTime);

            if (firstTrigger || this.isMatch(offset, MusicMath.getTickTime(this.bpm, this.quantization))) {
              firstTrigger = false;
              offset = 0;
              timeStamp = newTime;
              this.position.tick=this.tick;
              this.tickSubject.next(this.tick);
              let newBeat = MusicMath.getBeatNumber(this.tick, this.quantization, this.signature);

              if (newBeat !== lastBeat && newBeat !== -1) {
                lastBeat = newBeat;
                this.position.beat=newBeat;
                this.position.bar=MusicMath.getBarNumber(this.tick,this.quantization,this.signature);
                this.beatSubject.next(newBeat);
              }
              this.tick += 1;
            }
          }
        }

      };
      this.intervalHandle = setInterval(() => this._loop(), 1);
    }
  }

  destroy(): void {
    this.stop();
    //this.timeSubscription.unsubscribe();
    this.scheduler.destroy();
    if (this.intervalHandle) clearInterval(this.intervalHandle);
  }

  pause(): void {
    this.pauseTime = this.scheduler.getSysTime();
    this.paused = true;
    this.looper=false;
  }

  stop(): void {
    this.pauseTime = 0;
    this.paused = false;
    this.startOffset = null;
    this.looper=false;
  }


}
