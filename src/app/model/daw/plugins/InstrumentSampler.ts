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

export  class InstrumentSampler extends AudioPlugin {

  protected samples:Array<Sample>=[];
  protected baseSampleNotes:Array<number>=[];

  protected inputNode: VirtualAudioNode<AudioNode>;
  protected outputNode: VirtualAudioNode<AudioNode>;

  private currentPlayingNotes:Array<string>=[];

  constructor(
    protected id:string,
    protected deviceEvents: EventEmitter<DeviceEvent<any>>,
    protected notes: Notes,
    private pluginInfo: PluginInfo,
    private sampleGetter: (instrumentName: string) => Promise<{ samples: Array<Sample>, baseNotes: Array<number> }>) {
    super(deviceEvents);
    this.id=id;
  }


  getInfo():PluginInfo{
    return this.pluginInfo;
  }

  feed(event: NoteEvent, offset: number): any {
    let eventNote = this.notes.getNote(event.note);
    let sample = this.chooseSample(this.notes.getNote(event.note));

    let detune = this.notes.getInterval(sample.baseNote, eventNote) * 100;


    sample.triggerWith(offset, detune, ADSREnvelope.fromNote(event), event.length / 1000);

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
          resolve();
        })
        .catch(error => reject(error));
    })
  }

  getNotes(): Array<string> {
    if (this.pluginInfo.noteRange) return this.notes.getNoteRange(this.pluginInfo.noteRange.start, this.pluginInfo.noteRange.end);
    else this.notes.getNoteRange("C0", "B10");
  }

  getInstrumentCategory(): InstrumentCategory {
    return InstrumentCategory.KEYS;
  }


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


  startPlay(event: NoteEvent):AudioBufferSourceNode {
    let eventNote = this.notes.getNote(event.note);
    let sample =this.chooseSample(this.notes.getNote(event.note));
    let detune = this.notes.getInterval(sample.baseNote, eventNote) * 100;
    this.currentPlayingNotes.push(event.note);
    return sample.start(0, detune, ADSREnvelope.fromNote(event));
  }

  stopPlay(node:AudioBufferSourceNode): void {
    node.stop();
  }



}
