import {Subject} from "rxjs/internal/Subject";
import {TriggerEvent} from "./TriggerEvent";
import {Trigger} from "./Trigger";
import {System} from "../../../system/System";

export class TriggerContext {
  private triggers: Array<Trigger<any>> = [];
  trigger: Subject<TriggerEvent> = new Subject<TriggerEvent>();

  constructor(private system:System) {
    this.trigger.asObservable().subscribe((event: TriggerEvent) => this.nextEvent(event));
  }

  clear():void{
    this.triggers.length=0;
  }

  addTrigger(trigger:Trigger<any>):void{
    this.triggers.push(trigger);
  }

  private nextEvent(event: TriggerEvent): void {
    let found=false;
    this.triggers.forEach(trigger => {
      if (trigger.test(event)) {
        found=true;
        trigger.resolve();
      }
    });
    if (!found) this.system.warn("no trigger found for "+JSON.stringify(event));
  }
}
