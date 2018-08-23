import {TransportParams} from "../../model/daw/TransportParams";
import {Observable, Subject} from "rxjs";
import {EventEmitter, Inject, Injectable} from "@angular/core";
import {TransportPosition} from "../../model/daw/TransportPosition";
import {MusicMath} from "../../model/utils/MusicMath";
import {TransportEvents} from "../../model/daw/events/TransportEvents";
import {TransportInfo} from "../../model/daw/TransportInfo";


@Injectable()
export class TransportService {
  params: TransportParams = new TransportParams();
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void> = new EventEmitter<void>();
  transportStart: EventEmitter<void> = new EventEmitter<void>();
  beforeStart: EventEmitter<void> = new EventEmitter<void>();
  timeReset: EventEmitter<number> = new EventEmitter<number>();
  private position: TransportPosition;
  private intervalHandle: any;
  private run: boolean = false;
  private tickSubject: Subject<number> = new Subject<number>();
  private beatSubject: Subject<number> = new Subject<number>();
  private timeSubject: Subject<number> = new Subject<number>();


  constructor(@Inject("AudioContext") private audioContext: AudioContext) {
    this.tickTock = this.tickSubject.asObservable();
    this.beat = this.beatSubject.asObservable();
    this.time = this.timeSubject.asObservable();
    this.position = new TransportPosition();
    this.position.beat = 0;
    this.position.bar = 0;
    this.position.time = 0;
    this.position.tick = 0;

    this.params.quantization.subscribe(quantization=>{

    })

  }

  /* getPositionInfo(): TransportPosition {
     return this.position;
   }*/

  private getTickTime():number{
    return MusicMath.getTickTime(this.params.bpm.getValue(), this.params.quantization.getValue());
  }
  private getBeatTime():number{
    return MusicMath.getBeatTime(this.params.bpm.getValue(), this.params.quantization.getValue());
  }

  private getStartTime():number{
    return this.params.loopStart.getValue() * this.getBeatTime();
  }

  private getEndTime():number{
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

        if (this.params.loop) {
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
    return this.intervalHandle && this.intervalHandle >= 0;
  }


  getEvents(): TransportEvents {
    return {
      tickTock: this.tickTock,
      time: this.time,
      beat: this.beat,
      beforeStart: this.beforeStart,
      transportEnd: this.transportEnd,
      transportStart: this.transportStart,
      timeReset: this.timeReset
    }
  }

  getInfo(): TransportInfo {
    return {
      isRunning: () => this.isRunning(),
      getStartTime: () => this.getStartTime(),
      getEndTime: () => this.getEndTime()
    }
  }
}
