import {Frequencies} from "./theory/Frequencies";
import {Note} from "./theory/Note";
import {Playable} from "./Playable";
import {Dynamics} from "./theory/Dynamics";

export class Sample implements Playable {
  id: string;
  buffer: AudioBuffer;
  category: string;
  url: string;
  baseNote: Note;
  private gainNode:GainNode;
  private sourceNode:AudioBufferSourceNode;
  private nodesLoaded:boolean=false;

  constructor(id: string, buffer: AudioBuffer, category: string, url: string, private context: AudioContext) {
    this.id = id;
    this.buffer = buffer;
    this.category = category;
    this.url = url;
  }

  loadNodes():void{
    this.sourceNode = this.context.createBufferSource();
    this.sourceNode.buffer = this.buffer;
    this.gainNode = this.context.createGain();
    this.sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
    this.nodesLoaded=true;
  }

  public play(when: number, duration: number, notes: Array<Note>, dynamics: Dynamics) {

    this.loadNodes();
    notes.forEach(note => {
      let detune = 0;
      if (note && this.baseNote != note) {
        detune = Note.interval(this.baseNote, note) * Frequencies.SEMITONE;
      }
      this.sourceNode.detune.value = detune;
      this.gainNode.gain.setValueCurveAtTime(dynamics.getGainCurve(), this.context.currentTime, this.context.currentTime + duration);
      this.sourceNode.start(when, 0, duration && duration != 0 ? duration : undefined);
    })

  }
}
