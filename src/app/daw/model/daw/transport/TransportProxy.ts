import {Transport} from "./Transport";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {EventEmitter} from "@angular/core";

import {TransportInterface} from "./TransportInterface";
import {TransportReader} from "./TransportReader";
import {TimeSignature} from "../../mip/TimeSignature";
import {NoteLength} from "../../mip/NoteLength";
import {TransportEvents} from "./TransportEvents";
import {MusicMath} from "../../utils/MusicMath";
import {MasterTransportParams} from "./MasterTransportParams";
import {Subscription} from "rxjs/internal/Subscription";



export class TransportProxy implements TransportInterface,TransportReader,TransportEvents {
  readonly quantization: BehaviorSubject<NoteLength> = new BehaviorSubject<NoteLength>(NoteLength.Quarter);
  readonly loopStart: BehaviorSubject<number> = new BehaviorSubject(0);//beats
  readonly loopEnd: BehaviorSubject<number> = new BehaviorSubject<number>(0);//beats
  readonly loop: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly time: Observable<number>;
  readonly transportEnd: EventEmitter<void> = new EventEmitter<void>();
  readonly transportStart: EventEmitter<void> = new EventEmitter<void>();
  readonly beforeStart: EventEmitter<void> = new EventEmitter<void>();
  readonly beat: Observable<number>;
  readonly tickTock: Observable<number>;
  readonly timeReset: EventEmitter<number> = new EventEmitter();

  private tickSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private beatSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private timeSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private bpm:number;
  private signature:TimeSignature;

  private subscriptions:Array<Subscription>=[];

  constructor(private transport: Transport, private masterParams: MasterTransportParams) {

    this.time = this.timeSubject.asObservable();
    this.beat = this.beatSubject.asObservable();
    this.tickTock = this.tickSubject.asObservable();
    let subscription = transport.time.subscribe(time => {
      this.timeSubject.next(time);
    });
    this.subscriptions.push(subscription);
    subscription=transport.beat.subscribe(beat => {
      this.beatSubject.next(beat)
    });
    this.subscriptions.push(subscription);
    subscription=transport.tickTock.subscribe(tick => {
      this.tickSubject.next(tick)
    });
    this.subscriptions.push(subscription);
    subscription=transport.timeReset.subscribe(() => this.timeReset.emit());
    this.subscriptions.push(subscription);
    subscription=transport.transportEnd.subscribe(() => this.transportEnd.next());
    this.subscriptions.push(subscription);
    transport.transportStart.subscribe(() => this.transportStart.next());
    transport.beforeStart.subscribe(() => this.beforeStart.next());

    masterParams.bpm.subscribe(bpm=>this.bpm=bpm);
    masterParams.signature.subscribe(signature=>this.signature=signature);
  }

  destroy(): void {
  }

  getBeat(): number {
    return 0;
  }

  getBpm(): number {
    return 0;
  }

  getEndTime(): number {
    return 0;
  }

  getLoopEnd(): number {
    return 0;
  }

  getLoopStart(): number {
    return 0;
  }

  getQuantization(): NoteLength {
    return undefined;
  }

  getSignature(): TimeSignature {
    return undefined;
  }

  getStartTime(): number {
    return 0;
  }

  getTick(): number {
    return 0;
  }

  getTime(): number {
    return 0;
  }

  isLoop(): boolean {
    return false;
  }

  isRunning(): boolean {
    return false;
  }

  start(): void {
  }

  stop(): void {
  }
}
