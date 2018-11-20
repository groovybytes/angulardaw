import {Sample} from "../Sample";
import {WstPlugin} from "./WstPlugin";
import {NoteInfo} from "../../utils/NoteInfo";
import {NoteTrigger} from "../NoteTrigger";
import {PluginInfo} from "./PluginInfo";
import {Instrument} from "./Instrument";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {ADSREnvelope} from "../../mip/ADSREnvelope";
import {Notes} from "../Notes";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";

export abstract class AbstractInstrumentSampler extends Instrument implements WstPlugin {

  protected samples:Array<Sample>=[];
  protected baseSampleNotes:Array<number>=[];

  protected inputNode: VirtualAudioNode<AudioNode>;
  protected outputNode: VirtualAudioNode<AudioNode>;

  constructor(
    protected id:string,
    protected notes: Notes,
    private info:PluginInfo) {
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
    let eventNote = this.notes.getNote(event.note);
    let sample = this.chooseSample(this.notes.getNote(event.note));

    let detune = this.notes.getInterval(sample.baseNote, eventNote) * 100;

    sample.triggerWith(offset, detune, ADSREnvelope.fromNote(event), event.length / 1000);

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

  getInputNode(): VirtualAudioNode<AudioNode> {
    return this.inputNode;
  }

  getOutputNode(): VirtualAudioNode<AudioNode> {
    return this.outputNode;
  }

  setInputNode(node: VirtualAudioNode<AudioNode>): void {
    this.inputNode=node;
  }

  setOutputNode(node: VirtualAudioNode<AudioNode>): void {
    this.outputNode=node;
    this.samples.forEach(sample=>sample.setDestination(node.node));
  }

  abstract getInstrumentCategory(): InstrumentCategory;



}
