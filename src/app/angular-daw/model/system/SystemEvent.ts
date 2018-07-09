import {SystemEventType} from "./SystemEventType";

export class SystemEvent {
  constructor(eventType: SystemEventType, data: any) {
    this.eventType = eventType;
    this.data = data;
  }
  timeStamp: number;
  eventType: SystemEventType;
  data: any;

}
