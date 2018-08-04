import {EventDto} from "../../shared/api/EventDTO";

export class SequencerEvent{
  trackEvent:EventDto;
  row:number;

  constructor(trackEvent:EventDto, row: number) {
    this.trackEvent = trackEvent;
    this.row = row;
  }
}
