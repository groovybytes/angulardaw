import {PerformanceStreamer} from "./events/PerformanceStreamer";
import {WstPlugin} from "./WstPlugin";
import {Subscription} from "rxjs";
import {TrackControlParameters} from "./TrackControlParameters";
import {Pattern} from "./Pattern";
import {NoteTrigger} from "./NoteTrigger";
import {Transport} from "./transport/Transport";

export class Track {
  id: any;
  index: number;
  name: string;
  focusedPattern: Pattern;
 /* patterns: Array<Pattern> = [];*/
  pluginId: string;
  ghost: boolean = false;
  events: Array<NoteTrigger> = [];
  controlParameters: TrackControlParameters = new TrackControlParameters();
  private streamer: PerformanceStreamer;
  private subscriptions: Array<Subscription> = [];
  plugin: WstPlugin;
  destinationNode: AudioNode;
  gainNode: GainNode;
  transport: Transport;


  //gain: BehaviorSubject<number> = new BehaviorSubject(100);

  constructor(
    id: string,
    index:number,
    private audioContext: AudioContext,
    master:Transport,
    transport: Transport) {

    this.index=index;
    this.transport=transport;
    this.streamer = new PerformanceStreamer(this.events, master,transport, transport);
    this.subscriptions.push(this.streamer.trigger.subscribe(event => this.onNextEvent(event.offset, event.event)));
    this.destinationNode = this.audioContext.destination;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.destinationNode);
    this.controlParameters.gain.subscribe(gain => {
      this.gainNode.gain.setValueAtTime(gain / 100, audioContext.currentTime);
    });

    this.id = id;
  }

  private onNextEvent(offset: number, event: NoteTrigger): void {
    if (this.controlParameters.mute.getValue() === false) this.plugin.feed(event, offset, this.gainNode);
  }


  resetEvents(events: Array<NoteTrigger>): void {
    this.events = events;
    this.streamer.updateEventQueue(events);
  }

  /* addEvent(event: NoteTriggerViewModel): void {
     let insertIndex = _.sortedIndexBy(this.model.events, {'time': event.time}, event => event.time);
     this.model.events.splice(insertIndex, 0, event);
   }

   removeEvent(id:string): void {
     let index = this.model.events.findIndex(ev=>ev.id===id);
     this.model.events.splice(index, 1);

   }*/

  destroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


}
