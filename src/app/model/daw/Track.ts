import {Subscription} from "rxjs";
import {TrackControlParameters} from "./TrackControlParameters";
import {VirtualAudioNode} from "./VirtualAudioNode";
import {TrackCategory} from "./TrackCategory";
import {AudioPlugin} from "./plugins/AudioPlugin";


export class Track {

  readonly id: string;
  category:TrackCategory=TrackCategory.DEFAULT;
  name: string;
  color:string;
  controlParameters: TrackControlParameters=new TrackControlParameters();
  private subscriptions: Array<Subscription> = [];
  plugins: Array<AudioPlugin>=[];
  inputNode:VirtualAudioNode<PannerNode>;
  outputNode:VirtualAudioNode<GainNode>;

 constructor(id:string,
             inputNode:VirtualAudioNode<PannerNode>,
             outputNode:VirtualAudioNode<GainNode>,
             private audioContext:AudioContext){
   this.id=id;
   this.inputNode=inputNode;
   this.outputNode=outputNode;
   this.subscriptions.push(this.controlParameters.gain.subscribe(gain => {
     this.outputNode.node.gain.setValueAtTime(gain / 100, audioContext.currentTime);
   }));
   this.subscriptions.push(this.controlParameters.record.subscribe(record => {
     this.plugins.forEach(plugin=>{
       plugin.hot.next(record===true);
     })
   }));

 }


  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getMasterPlugin():AudioPlugin{
    return this.plugins[0];
  }


}
