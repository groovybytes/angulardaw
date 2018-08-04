import {Track} from "./Track";
import {TrackCategory} from "./TrackCategory";
import {TransportEvents} from "./TransportEvents";
import {TransportInfo} from "./TransportInfo";
import {Subscription} from "rxjs/internal/Subscription";

export class ClickTrack extends Track{

  private subscriptions: Array<Subscription> = [];


  constructor(protected transportEvents:TransportEvents,protected transportInfo:TransportInfo) {
    super(transportEvents, transportInfo);
    this.category = TrackCategory.CLICK;
    this.subscriptions.push(this.transportEvents.beat.subscribe(beat=>this.instrument.play(beat===0?"A1":"B1")));
  }

  destroy(): void {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }


}
