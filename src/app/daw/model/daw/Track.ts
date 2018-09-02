import {WstPlugin} from "./WstPlugin";
import {Subscription} from "rxjs";
import {TrackControlParameters} from "./TrackControlParameters";
import {NoteTrigger} from "./NoteTrigger";


export class Track {

  id: string;
  index: number;
  name: string;
  color:string;
  controlParameters: TrackControlParameters=new TrackControlParameters();
  private subscriptions: Array<Subscription> = [];
  plugin: WstPlugin;
  destinationNode: AudioNode;
  gainNode: GainNode;


  constructor(
    id: string,
    index: number,
    private audioContext: AudioContext) {

    this.index = index;
    this.destinationNode = this.audioContext.destination;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.destinationNode);
    this.subscriptions.push(this.controlParameters.gain.subscribe(gain => {
      this.gainNode.gain.setValueAtTime(gain / 100, audioContext.currentTime);
    }));

    this.id = id;
  }

  private onNextEvent(offset: number, event: NoteTrigger): void {
    if (this.controlParameters.mute.getValue() === false) this.plugin.feed(event, offset, this.gainNode);
  }


  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
