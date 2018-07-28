
import {NoteInfo} from "../utils/NoteInfo";
import {Playable} from "./Playable";
import {Dynamics} from "../utils/Dynamics";
import {ADSREnvelope} from "../mip/ADSREnvelope";
import {Frequencies} from "../mip/Frequencies";

export class Sample implements Playable {
  id: string;
  buffer: AudioBuffer;
  category: string;
  url: string;
  baseNote: NoteInfo;
  private gainNode: GainNode;
  private sourceNode: AudioBufferSourceNode;
  private nodesLoaded: boolean = false;


  constructor(id: string, buffer: AudioBuffer, category: string, url: string, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;
    this.category = category;
    this.url = url;
  }

  private loadNodes(): void {
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.gainNode = this.context.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.nodesLoaded = true;
  }

  public play(when: number, duration: number, notes: Array<NoteInfo>, dynamics: Dynamics) {

    this.loadNodes();
    notes.forEach(note => {
      let detune = 0;
      if (note && this.baseNote && this.baseNote != note) {
        detune = NoteInfo.interval(this.baseNote, note) * Frequencies.SEMITONE;
      }

      this.sourceNode.detune.value = detune;
      this.gainNode.gain.setValueCurveAtTime(dynamics.getGainCurve(), this.context.currentTime, this.context.currentTime + duration);
      this.sourceNode.start(when, 0, duration && duration != 0 ? duration : undefined);
    })

  }

  public triggerWith(adsr:ADSREnvelope,reverb:Sample):void{

/*    let convolver=this.context.createConvolver();
    convolver.buffer=reverb.buffer;
    convolver.connect(this.context.destination);*/
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.gainNode = this.context.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    adsr.apply(this.gainNode,this.context.currentTime);
    this.sourceNode.start(0, 0, 1);
  }

 /* public triggerWith(adsr:ADSREnvelope,reverb:Sample):void{

    let splitter = this.context.createChannelSplitter(2);
    let merger = this.context.createChannelMerger(2);
    merger.connect(this.context.destination);
    let convolver=this.context.createConvolver();
    convolver.buffer=reverb.buffer;
    convolver.connect(merger,1,0);
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.gainNode = this.context.createGain();
    this.gainNode.connect(splitter,0);
    splitter.connect(convolver,1);
    splitter.connect(convolver,1);
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(convolver);
    adsr.apply(this.gainNode,this.context.currentTime);
    this.sourceNode.start(0, 0, 1);
  }*/

  public trigger() {
    this.loadNodes();
    this.sourceNode.start(0,0,10);
  }

}
