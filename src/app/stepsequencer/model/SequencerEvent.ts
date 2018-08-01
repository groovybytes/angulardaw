import {EventDTO} from "../../shared/api/EventDTO";

export class SequencerEvent{
  trackEvent:EventDTO;
  row:number;

  constructor(trackEvent:EventDTO, row: number) {
    this.trackEvent = trackEvent;
    this.row = row;
  }
}
