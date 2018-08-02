import {Observable} from "rxjs/internal/Observable";
import {TransportPosition} from "./TransportPosition";
import {EventEmitter} from "@angular/core";

export interface TransportObservable {
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void>;
  transportStart: EventEmitter<void>;
  timeReset: EventEmitter<number>;
  isRunning():boolean;
  getPositionInfo(): TransportPosition;
  getStartTime():number;
  getEndTime():number;
}
