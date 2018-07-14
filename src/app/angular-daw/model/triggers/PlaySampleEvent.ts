import {TriggerEvent} from "./TriggerEvent";

export class PlaySampleEvent implements TriggerEvent{
  note:string;

  constructor(note: string) {
    this.note = note;
  }
}
