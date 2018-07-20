import {TransportControl} from "./TransportControl";
import {Observable} from "rxjs/internal/Observable";
import {EventEmitter} from "@angular/core";
import {Transport} from "./Transport";

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







}
