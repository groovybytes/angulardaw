import {Observable} from "rxjs/internal/Observable";
import {EventEmitter} from "@angular/core";
import {TransportPosition} from "./TransportPosition";

export interface TransportControl {
  loop: boolean;
  running:boolean;
  tickTock: Observable<number>;
  beat: Observable<number>;
  time: Observable<number>;
  transportEnd: EventEmitter<void>;
  tickStart: number;
  tickEnd: number;
  start(): void;
  pause(): void;
  stop(): void;
  getPosition():TransportPosition;
}
