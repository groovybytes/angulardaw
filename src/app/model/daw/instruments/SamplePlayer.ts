/*
import {TriggerContext} from "../../triggers/TriggerContext";
import {Articulation} from "../../mip/drums/classes/Articulation";
import {Sample} from "../Sample";
import {Severity} from "../../../system/Severity";
import {Trigger} from "../../triggers/Trigger";

export abstract class SamplePlayer {

  context: TriggerContext<string,Sample>;
  samples: Array<Sample>;

  play(sampleId:string,articulation:Articulation):void{
    let sample =this.samples.filter(sample => sample.id === sampleId && sample.articulation === articulation)[0]
  }
  addTrigger(note:string,sampleId:string,articulation:Articulation):void{
    let trigger = new Trigger<string, Sample>((_note: string) => {
      return _note === note;
    }, () => {
      return this.samples.filter(sample => sample.piece === piece && sample.articulation === articulation)[0];
    }, (subject: Sample) => {
      if (!subject) this.system.warn("sample not found for : " + piece).notify("what?!", Severity.WARNING);
      subject.sample.trigger();
    });
    this.context.triggers.push(trigger);
  }


}
*/
