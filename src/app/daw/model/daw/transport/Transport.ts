import {Observable} from "rxjs";
import {EventEmitter} from "@angular/core";
import {TransportPosition} from "./TransportPosition";
import {MusicMath} from "../../utils/MusicMath";
import {TimeSignature} from "../../mip/TimeSignature";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {TransportSettings} from "./TransportSettings";
import {TransportEvent} from "./TransportEvent";


export class Transport {

  channels: Array<string>=[];
  settings: TransportSettings;
  time: Observable<TransportEvent<number>>;
  transportEnd: EventEmitter<TransportEvent<void>> = new EventEmitter<TransportEvent<void>>();
  transportStart: EventEmitter<TransportEvent<void>> = new EventEmitter<TransportEvent<void>>();
  beforeStart: EventEmitter<TransportEvent<void>> = new EventEmitter<TransportEvent<void>>();
  timeReset: EventEmitter<TransportEvent<void>> = new EventEmitter<TransportEvent<void>>();
  private position: TransportPosition;
  private intervalHandle: any;
  private run: boolean = false;
  private timeSubject: BehaviorSubject<TransportEvent<number>>
    = new BehaviorSubject<TransportEvent<number>>(null);

  private startTime:number;


  constructor(
    private audioContext: AudioContext, settings: TransportSettings) {

    /*  this.tickTock = this.tickSubject.asObservable();
      this.beat = this.beatSubject.asObservable();*/
    this.time = this.timeSubject.asObservable();
    this.settings = settings;
    this.position = new TransportPosition();
    this.position.beat = 0;
    this.position.bar = 0;
    this.position.time = 0;
    this.position.tick = 0;

  }



  private getBeatTime(): number {

    return MusicMath.getBeatTime(this.settings.global.bpm);
  }

  private getStartTime(): number {
    return MusicMath.getStartTime(this.settings.loopStart, this.settings.global.bpm);
  }

  private getEndTime(): number {
    return this.settings.loopEnd * this.getBeatTime();
  }

  start(): void {
    if (this.isRunning()) this.stop();
    this.startTime = this.audioContext.currentTime;
    this.beforeStart.emit(new TransportEvent<void>(this.channels));
    this.run = true;
    this.timeReset.emit(new TransportEvent<void>(this.channels));

    this.intervalHandle = setInterval(() => {
      let currentTime = this.audioContext.currentTime - this.startTime;
      this.timeSubject.next( new TransportEvent<number>(this.channels,currentTime));


      /*if (currentTime > this.getEndTime() / 1000) {

        if (this.settings.loop) {
          start = this.audioContext.currentTime;
        }
        else {
          this.run = false;
          this.transportEnd.emit(new TransportEvent<void>(this.channel));
        }

      }
      else {
        this.timeSubject.next( new TransportEvent<number>(this.channel,currentTime));
      }*/
    }, 5)

  }

 /* resetStartTime():void{
    this.startTime = this.audioContext.currentTime;
  }*/

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
    this.transportEnd.emit(new TransportEvent<void>(this.channels));
  }

  isRunning(): boolean {
    return this.run;
  }
}
