import {Subscription} from "rxjs";
import {TrackControlParameters} from "./TrackControlParameters";
import {Plugin} from "./plugins/Plugin";
import {WstPlugin} from "./plugins/WstPlugin";
import {Instrument} from "./plugins/Instrument";
import {VirtualAudioNode} from "./VirtualAudioNode";
import {TrackCategory} from "./TrackCategory";


export class Track {

  readonly id: string;
  category:TrackCategory=TrackCategory.DEFAULT;
  name: string;
  color:string;
  controlParameters: TrackControlParameters=new TrackControlParameters();
  private subscriptions: Array<Subscription> = [];
  plugins: Array<Plugin>=[];
  inputNode:VirtualAudioNode<PannerNode>;
  outputNode:VirtualAudioNode<GainNode>;

 constructor(id:string,inputNode:VirtualAudioNode<PannerNode>,outputNode:VirtualAudioNode<GainNode>,private audioContext:AudioContext){
   this.id=id;
   this.inputNode=inputNode;
   this.outputNode=outputNode;
   this.subscriptions.push(this.controlParameters.gain.subscribe(gain => {
     this.outputNode.node.gain.setValueAtTime(gain / 100, audioContext.currentTime);
   }));
 }

 /* constructor(
    id: string,
    index: number,
     port:AudioPort,
    private audioContext: AudioContext) {

    this.index = index;
    this.port=port;
    /!*this.destinationNode = this.audioContext.destination;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.destinationNode);*!/
    this.subscriptions.push(this.controlParameters.gain.subscribe(gain => {
     // this.gainNode.gain.setValueAtTime(gain / 100, audioContext.currentTime);
    }));

    this.id = id;
  }*/

  /*private onNextEvent(offset: number, event: NoteTrigger): void {
   // if (this.controlParameters.mute.getValue() === false) this.plugin.feed(event, offset, this.gainNode);
  }*/


  getInstrumentPlugin():WstPlugin{
    return <WstPlugin>this.plugins.find(p=>p instanceof Instrument);
  }

  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
