import {Subject} from "rxjs/internal/Subject";

import {Trigger} from "./Trigger";
import {System} from "../../system/System";

export class TriggerContext<T,S> {
  triggers: Array<Trigger<T,S>> = [];
  trigger: Subject<T> = new Subject<T>();

  constructor(private system:System) {
    this.trigger.asObservable().subscribe((condition: T) => {

      this.next(condition)
    });
  }

  clear():void{
    this.triggers.length=0;
  }

  /*getTriggerSpectrum(){
      return this.triggers.map(t=>t.)
  }*/

  private next(condition: T): void {
    let found=false;

    this.triggers.forEach(trigger => {
      if (trigger.test(condition)) {
        found=true;
        trigger.resolve();
      }
    });
    if (!found) this.system.warn("no trigger found for "+event);
  }
}
