/*
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



export class TransportProxy {
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


}
*/
