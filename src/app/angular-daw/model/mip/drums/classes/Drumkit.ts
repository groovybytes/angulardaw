import {DrumSample} from "./DrumSample";
import {TriggerContext} from "../../../triggers/TriggerContext";
import {DrumMapping} from "../specs/DrumMapping";
import {Trigger} from "../../../triggers/Trigger";
import {System} from "../../../../../system/System";
import {Severity} from "../../../../../system/Severity";

export class Drumkit {

  context: TriggerContext;
  samples: Array<DrumSample> = [];

  constructor(private system:System) {
    this.context=new TriggerContext(system);
  }

  loadMapping(mapping:DrumMapping): void {
    this.context.clear();
    mapping.mappings.forEach(mapping => {
      let trigger = new Trigger<string>((note: string) => {
        return note === mapping.note;
      }, () => {
        let sample = this.samples.filter(sample => sample.piece === mapping.piece && sample.articulation === mapping.articulation)[0];
        if (!sample) this.system.warn("sample not found for : "+mapping).notify("what?!",Severity.WARNING);
        else sample.sample.trigger();
      })
      this.context.addTrigger(trigger);
    })
  }


}
