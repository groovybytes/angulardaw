import {Track} from "./Track";
import {TrackCategory} from "./TrackCategory";

export class ClickTrack extends Track{

  constructor() {
    super();
    this.category = TrackCategory.CLICK;
  }

  destroy(): void {
  }

  protected onTransportInit(): void {
    this.transport.beat.subscribe(beat=>this.instrument.play(beat===0?"A1":"B1"));
  }

}
