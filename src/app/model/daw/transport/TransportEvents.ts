import {Observable} from "rxjs/internal/Observable";
import {EventEmitter} from "@angular/core";

export interface TransportEvents {
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  beforeStart: EventEmitter<void>;
  transportEnd: EventEmitter<void>;
  transportStart: EventEmitter<void>;
  timeReset: EventEmitter<number>;

}
