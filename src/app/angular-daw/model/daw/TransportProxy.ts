import {TransportControl} from "./TransportControl";
import {Observable} from "rxjs/internal/Observable";
import {EventEmitter} from "@angular/core";
import {Transport} from "./Transport";
import {TransportPosition} from "./TransportPosition";

export class TransportProxy implements TransportControl{
  get running(): boolean {
    return this.transport.running;
  }
  get loop(): boolean {
    return this.transport.loop;
  }

  set loop(value: boolean) {
    this.transport.loop = value;
  }

  get tickEnd(): number {
    return this.transport.tickEnd;
  }

  set tickEnd(value: number) {
    this.transport.tickEnd = value;
  }

  get tickStart(): number {
    return this.transport.tickStart;
  }

  set tickStart(value: number) {
    this.transport.tickStart = value;
  }
  get beat(): Observable<number> {
    return this.transport.beat;
  }

  get tickTock(): Observable<number> {
    return this.transport.tickTock;
  }

  get time(): Observable<number> {
    return this.transport.time;
  }

  get transportEnd(): EventEmitter<void> {
    return this.transport.transportEnd;
  }
  get transportStart(): EventEmitter<void> {
    return this.transport.transportStart;
  }

  constructor(private transport:Transport){

  }

  pause(): void {
    this.transport.pause();
  }

  start(): void {
    this.transport.start();
  }

  stop(): void {
    this.transport.stop();
  }

  getPosition():TransportPosition{
    return this.transport.getPositionInfo();
  }







}
