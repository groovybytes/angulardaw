import {Sample} from "../Sample";
import {NoteInfo} from "../../utils/NoteInfo";
import {PluginInfo} from "./PluginInfo";
import {VirtualAudioNode} from "../VirtualAudioNode";
import {ADSREnvelope} from "../../mip/ADSREnvelope";
import {Notes} from "../../mip/Notes";
import {InstrumentCategory} from "../../mip/instruments/InstrumentCategory";
import {NoteEvent} from "../../mip/NoteEvent";
import {AudioPlugin} from "./AudioPlugin";
import {EventEmitter} from "@angular/core";
import {DeviceEvent} from "../devices/DeviceEvent";
import {Trigger} from "../Trigger";
import {TriggerSpec} from "../TriggerSpec";
import {SampleEventInfo} from "../SampleEventInfo";
import {sample} from "rxjs/operators";

export class InstrumentSampler extends AudioPlugin {

  protected samples: Array<Sample> = [];
  protected baseSampleNotes: Array<number> = [];

  protected inputNode: VirtualAudioNode<AudioNode>;
  protected outputNode: VirtualAudioNode<AudioNode>;

  //private runningSamples: Array<{ eventId: string, sample: Sample }> = [];

  constructor(
    protected id: string,
    protected notes: Notes,
    private pluginInfo: PluginInfo,
    private sampleGetter: (instrumentName: string) => Promise<{ samples: Array<Sample>, baseNotes: Array<number> }>) {
    super(notes);
    this.id = id;

  }


  getInfo(): PluginInfo {
    return this.pluginInfo;
  }

  getSample(note:string): Sample {

    return this.chooseSample(this.notes.getNote(note));
   // let detune = this.notes.getInterval(sample.baseNote, eventNote) * 100;

   // sample.trigger(event);// triggerWith(offset, detune, ADSREnvelope.fromNote(event), event.length / 1000);

   // return sample;

  }


  getId(): string {
    return this.id;
  }

  destroy(): void {
    super.destroy();
    this.samples.forEach(sample => sample.destroy());
  }

  load(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.sampleGetter(this.pluginInfo.folder)
        .then(result => {
          this.samples = result.samples;
          this.baseSampleNotes = result.baseNotes;

          this.notes.getNoteRange(this.getInfo().noteRange.start, this.getInfo().noteRange.end).forEach(note => {
            this.triggers.push(new Trigger(new TriggerSpec(note, note, null), null));
          });
          resolve();
        })
        .catch(error => reject(error));
    })
  }

  getNotes(): Array<string> {
    if (this.pluginInfo.noteRange) return this.notes.getNoteRange(this.pluginInfo.noteRange.start, this.pluginInfo.noteRange.end);
    else this.notes.getNoteRange("A0", "C7");
  }

  getInstrumentCategory(): InstrumentCategory {
    return InstrumentCategory.KEYS;
  }


  private chooseSample(note: NoteInfo): Sample {
    let closestSampleByNote = this.closest(this.baseSampleNotes, note.index);
    let sample = this.samples.find(sample => sample.baseNote.index === closestSampleByNote);
    if (!sample) console.warn("no sample found for note " + note.id);
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
    this.inputNode = node;
  }

  setOutputNode(node: VirtualAudioNode<AudioNode>): void {
    this.outputNode = node;
    this.samples.forEach(sample => sample.setDestination(node.node));
  }


 /* startPlay(event: SampleEventInfo): void {

    let sample = this.samples[0];//this.chooseSample(this.notes.getNote(event.note));
    this.runningSamples.push({eventId: event.id, sample: sample});
    sample.trigger(event);//, ADSREnvelope.fromNote(event));
  }*/


  /*startPlay(event: NoteEvent):AudioBufferSourceNode {
    let t1 = performance.now();
    let eventNote = this.notes.getNote(event.note);
    let sample =this.chooseSample(this.notes.getNote(event.note));
    let detune = this.notes.getInterval(sample.baseNote, eventNote) * 100;
    this.currentPlayingNotes.push(event.note);
    console.log(performance.now()-t1);
    return sample.start(0, detune, ADSREnvelope.fromNote(event));
  }*/

 /* stopPlay(id: string): void {
    let index = this.runningSamples.findIndex(d => d.eventId === id);
    if (index >= 0) {
      this.runningSamples[0].sample.stop();
      this.runningSamples.splice(index, 1);
    }
  }*/

 /* stop(): void {

    this.samples.forEach(sample => sample.stop());
  }*/

  getPushSettingsHint(): string {
    return "default";
  }


}
