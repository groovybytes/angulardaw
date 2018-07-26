import {DrumSample} from "./DrumSample";
import {TriggerContext} from "../../../triggers/TriggerContext";
import {DrumMapping} from "../specs/DrumMapping";
import {Trigger} from "../../../triggers/Trigger";
import {System} from "../../../../system/System";
import {Severity} from "../../../../system/Severity";
import {Articulation} from "./Articulation";

export class Drumkit {

  context: TriggerContext<string,DrumSample>;
  samples: Array<DrumSample> = [];

  constructor(private system: System) {
    this.context = new TriggerContext<string,DrumSample>(system);
  }

  loadMapping(mapping: DrumMapping): void {
    this.context.clear();
    mapping.mappings.forEach(mapping => this.addTrigger(mapping.note,mapping.piece,mapping.articulation));
  }

  addTrigger(note:string,piece:string,articulation:Articulation):void{
    let trigger = new Trigger<string, DrumSample>((_note: string) => {
      return _note === note;
    }, () => {
      return this.samples.filter(sample => sample.piece === piece && sample.articulation === articulation)[0];
    }, (subject: DrumSample) => {
      if (!subject) this.system.warn("sample not found for : " + piece).notify("what?!", Severity.WARNING);
      subject.sample.trigger();
    });
    this.context.triggers.push(trigger);
  }

  /*getSampleForNote(note: string): DrumSample {
    let sample = this.samples.filter(sample => sample.)[0];
  }*/


}
