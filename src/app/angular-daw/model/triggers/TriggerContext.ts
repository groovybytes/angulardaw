import {Subject} from "rxjs/internal/Subject";
import {TriggerEvent} from "./TriggerEvent";
import {Trigger} from "./Triggerable";

export class TriggerContext {
  triggers: Array<Trigger<any>> = [];
  trigger: Subject<TriggerEvent> = new Subject<TriggerEvent>();

  constructor() {
    this.trigger.asObservable().subscribe((event: TriggerEvent) => this.nextEvent(event));
  }

  private nextEvent(event: TriggerEvent): void {

    this.triggers.forEach(trigger => {
      if (trigger.test(event)) trigger.resolve();
    })
  }
}
