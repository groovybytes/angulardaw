import {Sample} from "../Sample";
import {WstPlugin} from "./WstPlugin";
import {NoteInfo} from "../../utils/NoteInfo";
import {TheoryService} from "../../../shared/services/theory.service";
import {ADSREnvelope} from "../../mip/ADSREnvelope";
import {NoteTrigger} from "../NoteTrigger";
import {PluginInfo} from "./PluginInfo";
import {Instrument} from "./Instrument";
import {VirtualAudioNode} from "../VirtualAudioNode";

export abstract class AbstractInstrumentSampler extends Instrument implements WstPlugin {
  inputNode: VirtualAudioNode<AudioNode>;
  outputNode: VirtualAudioNode<AudioNode>;
  protected samples:Array<Sample>=[];
  protected baseSampleNotes:Array<number>=[];

  constructor(protected id:string,protected theoryService: TheoryService,private info:PluginInfo) {
    super();
    this.id=id;
  }


  abstract getNotes(): Array<string>;

  abstract getId(): string;

  abstract destroy(): void;

  getInfo():PluginInfo{
    return this.info;
  }

  feed(event: NoteTrigger, offset: number): any {
    let eventNote = this.theoryService.getNote(event.note);
    let sample = this.chooseSample(this.theoryService.getNote(event.note));

    let detune = this.theoryService.getInterval(sample.baseNote,eventNote)*100;

    sample.triggerWith(offset,detune,this.outputNode.node,ADSREnvelope.fromNote(event),event.length/1000);

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
