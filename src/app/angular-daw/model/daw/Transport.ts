import {Subject} from 'rxjs';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Observable} from "rxjs/internal/Observable";

export class Transport {


  get tickInterval(): number {
    return this._tickInterval;
  }

  set tickInterval(value: number) {
    this._tickInterval = value;
  }


  get running(): boolean {
    return this._running;
  }

  loop: boolean = false;
  tickStart: number = 0;
  tickEnd: number = Number.MAX_VALUE;

  private _running: boolean = false;

  time: Observable<number> = new Observable<number>();
  private timeSubject: Subject<number> = new Subject<number>();
  tickTock: Observable<number> = new Observable<number>();
  private tickSubject: Subject<number> = new Subject<number>();

  private intervalHandle: any;
  private threshold = 10;
  private pauseTime: number = 0;
  private startOffset: number;
  private paused: boolean = false;
  private _loop: () => void;
  private _tickInterval: number = 500; //120bpm
  private tick: number = 0;

  constructor(private getTime: () => number) {
    this.tickTock = this.tickSubject.asObservable();
    this.time = this.timeSubject.asObservable();
  }


  private isMatch(transportTime: number, noteTime: number): boolean {
    return noteTime - transportTime < this.threshold;
  }

  start(): void {
    let end=false;
    if (this.paused) {
      this.paused = false;
      this.startOffset += this.getTime() - this.pauseTime;
      this.intervalHandle = setInterval(() => this._loop(), 1);
    }
    else {
      if (this.intervalHandle) this.stop();
      let timeStamp = 0;
      let offset = 0;
      let firstTrigger = true;
      this.tick = this.tickStart;


      this._loop = () => {
        console.log(this.tickEnd);
        if (this.tickEnd === this.tick) {
          if (this.loop){
            this.tick = this.tickStart;
            this.startOffset = this.getTime();
            offset = 0;
            timeStamp = 0;
          }
          else {
            end = true;
            clearInterval(this.intervalHandle);
          }
        }
        if (!end) {
          if (!this.startOffset) this.startOffset = this.getTime();
          let newTime = this.getTime() - this.startOffset;
          offset = (newTime - timeStamp) * 1000;

          this.timeSubject.next(newTime);
          if (firstTrigger || this.isMatch(offset, this._tickInterval)) {
            firstTrigger = false;
            offset = 0;
            timeStamp = newTime;
            this.tickSubject.next(this.tick);
            this.tick += 1;
          }
        }

      };
      this.intervalHandle = setInterval(() => this._loop(), 1);
      this._running = true;
    }
  }

  pause(): void {
    clearInterval(this.intervalHandle);
    this.pauseTime = this.getTime();
    this.paused = true;
  }

  stop(): void {
    clearInterval(this.intervalHandle);
    this.pauseTime = 0;
    this.paused = false;
    this.startOffset = null;
    this._running = false;
  }

}
