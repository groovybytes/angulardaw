import {NoteTriggerViewModel} from "../../model/viewmodel/NoteTriggerViewModel";


export class SequencerEvent{
  trackEvent:NoteTriggerViewModel;
  row:number;

  constructor(trackEvent:NoteTriggerViewModel, row: number) {
    this.trackEvent = trackEvent;
    this.row = row;
  }
}
