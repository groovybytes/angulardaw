import {Observable} from "rxjs";
import {EventEmitter} from "@angular/core";

export interface TransportInterface{
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void>;
  transportStart: EventEmitter<void>;
  beforeStart: EventEmitter<void>;
  timeReset: EventEmitter<number>;

  start(): void;
  destroy(): void;
  stop(): void;
  isRunning(): boolean;

}
