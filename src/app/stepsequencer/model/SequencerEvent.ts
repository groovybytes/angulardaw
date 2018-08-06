import {NoteTriggerDto} from "../../shared/api/NoteTriggerDto";


export class SequencerEvent{
  trackEvent:NoteTriggerDto;
  row:number;

  constructor(trackEvent:NoteTriggerDto, row: number) {
    this.trackEvent = trackEvent;
    this.row = row;
  }
}
