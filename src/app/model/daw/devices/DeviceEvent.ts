import {EventCategory} from "./EventCategory";

export class DeviceEvent<T> {
  constructor(deviceId:string,category: EventCategory, data: T) {
    this.deviceId=deviceId;
    this.category = category;
    this.data = data;
  }

  deviceId:string;
  category: EventCategory;
  data:T;
  //channels:Array<string>;
}
