import {SystemEventType} from "./SystemEventType";

export class SystemEvent<T> {
  constructor(eventType: SystemEventType, data: T) {
    this.eventType = eventType;
    this.data = data;
  }
  timeStamp: number;
  eventType: SystemEventType;
  data: T;

}
