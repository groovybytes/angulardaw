import {TrackEventHandler} from "./TrackEventHandler";
import {Drumkit} from "../mip/drums/classes/Drumkit";
import {TrackEvent} from "./TrackEvent";
import {Note} from "../mip/Note";

export class DrumTrackEventHandler implements TrackEventHandler{

  constructor(private drums:Drumkit){

  }
  next(events:Array<TrackEvent<Note>>):void{
    events.forEach(event=>this.drums.context.trigger.next(event.data.name));
  }
}
