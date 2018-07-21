import {TrackEvent} from "./TrackEvent";


export interface TrackEventHandler {
  next(event:Array<TrackEvent<any>>):void;
}
