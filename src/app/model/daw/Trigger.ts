import {Sample} from "./Sample";
import {TriggerSpec} from "./TriggerSpec";

export class Trigger{

  constructor(spec: TriggerSpec, sample: Sample) {
    this.spec = spec;
    this.sample = sample;
  }

  spec:TriggerSpec;
  sample: Sample;

}
