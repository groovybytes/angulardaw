import {Subject} from 'rxjs';
import {TransportPosition} from "../model/TransportPosition";
import {Injectable} from "@angular/core";
import {AudioContextService} from "./audiocontext.service";

@Injectable()
export class TransportService {

  constructor(private context: AudioContextService) {


  }

  get tickInterval(): number {
    return this._tickInterval;
  }

  set tickInterval(value: number) {
    this._tickInterval = value;
  }


  get running(): boolean {
    return this._running;
  }

  loop: {
    start: TransportPosition,
    end: TransportPosition
  }

  private _running: boolean = false;

  position: Subject<TransportPosition> = new Subject<TransportPosition>();
  tick: Subject<TransportPosition> = new Subject<TransportPosition>();

  private intervalHandle: any;
  private threshold = 10;
  private _position: TransportPosition = new TransportPosition(0, 0);
  private pauseTime: number = 0;
  private startOffset: number;
  private paused: boolean = false;
  private _loop: () => void;
  private useTick: boolean = false;

  private _tickInterval: number = 500; //120bpm


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
      /* let ticksTriggered = 0;*/
      let timeStamp = 0;
      let offset = 0;
      let firstTrigger = true;

      this._loop = () => {
        if (this.loop) {
          if (this.loop.end.tick === this._position.tick) {
            this._position.reset();// this.loop.start;
            this.startOffset = this.context.context().currentTime;
            offset = 0;
            timeStamp = 0;
          }
        }

        if (!this.startOffset) this.startOffset = this.context.context().currentTime;
        this._position.time = this.context.context().currentTime - this.startOffset;
        offset = (this._position.time - timeStamp) * 1000;

        if (firstTrigger || this.isMatch(offset, this._tickInterval)) {
          firstTrigger = false;
          offset = 0;

          timeStamp = this._position.time;
          this.tick.next(this._position);
          this._position.tick++;

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

}
