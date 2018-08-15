import {Sample} from "../Sample";
import {WstPlugin} from "../WstPlugin";
import {PluginId} from "./PluginId";
import {TransportPosition} from "../TransportPosition";
import {NoteTriggerViewModel} from "../../viewmodel/NoteTriggerViewModel";
import {NoteInfo} from "../../utils/NoteInfo";
import {TheoryService} from "../../../shared/services/theory.service";
import {ADSREnvelope} from "../../mip/ADSREnvelope";

export abstract class AbstractInstrumentSampler implements WstPlugin {

  protected samples:Array<Sample>=[];
  protected baseSampleNotes:Array<number>=[];

  constructor(protected theoryService: TheoryService) {

  }


  abstract getNotes(): Array<string>;

  abstract getId(): PluginId;

  abstract destroy(): void;

  feed(event: NoteTriggerViewModel, position: TransportPosition): any {
    let eventNote = this.theoryService.getNote(event.note);
    let sample = this.chooseSample(this.theoryService.getNote(event.note));

    let detune = this.theoryService.getInterval(sample.baseNote,eventNote)*100;
    sample.triggerWith(ADSREnvelope.default(),detune);
  }

  abstract load(): Promise<AbstractInstrumentSampler>;

  private chooseSample(note: NoteInfo): Sample {
    let closestSampleByNote = this.closest(this.baseSampleNotes, note.index);
    let sample =  this.samples.find(sample => sample.baseNote.index === closestSampleByNote);
    if (!sample) console.warn("no sample found for note "+note.id);
    return sample;
  }

  private closest(array: Array<number>, num) {
    var i = 0;
    var minDiff = 1000;
    var ans;
    array.forEach(() => {
      var m = Math.abs(num - array[i]);
      if (m < minDiff) {
        minDiff = m;
        ans = array[i];
      }
      i++;
    })
    return ans;
  }


}
