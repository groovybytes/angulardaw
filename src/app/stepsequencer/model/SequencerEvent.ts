import {TrackEvent} from "../../model/daw/TrackEvent";
import {Note} from "../../model/mip/Note";

export class SequencerEvent{
  trackEvent:TrackEvent<Note>;
  row:number;

  constructor(trackEvent: TrackEvent<Note>, row: number) {
    this.trackEvent = trackEvent;
    this.row = row;
  }
}
