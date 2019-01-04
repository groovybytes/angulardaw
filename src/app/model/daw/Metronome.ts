import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {TimeSignature} from "../mip/TimeSignature";
import {DawEvent} from "./DawEvent";
import {EventEmitter} from "@angular/core";
import {filter} from "rxjs/operators";
import {DawEventCategory} from "./DawEventCategory";
import {MusicMath} from "../utils/MusicMath";

export class Metronome {

  bpm: BehaviorSubject<number> = new BehaviorSubject(120);
  signature: TimeSignature = new TimeSignature(4, 4);

  private subscriptions: Array<Subscription> = [];

  constructor(
    private context: AudioContext,
    private events: EventEmitter<DawEvent<any>>,
    private destroyEvent: EventEmitter<void>,
    private enabled: BehaviorSubject<boolean>,
    private tickBuffer: AudioBuffer,
    private tockBuffer: AudioBuffer) {

    this.subscriptions.push(destroyEvent.subscribe(() => this.destroy()));
    this.subscriptions.push(events.pipe(filter((event => event.category === DawEventCategory.TICK)))
      .subscribe((event) => this.tick(event.data)));

  }

  private destroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }


  private tick(tick: number): void {

    if (this.enabled.getValue() === true) {
      let beat = tick % this.signature.barUnit;
      let buffer = (beat === 0 ? this.tickBuffer : this.tockBuffer);

      let sourceNode = this.context.createBufferSource();
      sourceNode.connect(this.context.destination);
      sourceNode.buffer = buffer;

      sourceNode.start(0, 0);
      //todo: remove event listener on destroy?
      sourceNode.addEventListener("ended", () => {
        sourceNode.disconnect();
        sourceNode = null;
      });
    }


  }

}
