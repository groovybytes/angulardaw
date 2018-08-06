/*
import {Track} from "./Track";
import {TrackCategory} from "./TrackCategory";
import * as _ from "lodash";
import {EventDto} from "../../shared/api/EventDTO";
import {Subscription} from "rxjs/internal/Subscription";
import {TransportEvents} from "./events/TransportEvents";
import {TransportInfo} from "./TransportInfo";
import {NoteTrigger} from "../mip/NoteTrigger";

export class MidiTrack extends Track {

  constructor(projectId:any,protected transportEvents:TransportEvents,protected transportInfo:TransportInfo) {
    super(projectId,transportEvents, transportInfo);
    this.category = TrackCategory.MIDI;
    this.subscriptions.push(this.transportEvents.time.subscribe(time => this.onTransportTime(time)));
    this.subscriptions.push(this.transportEvents.timeReset.subscribe(() => {
      let startTime = this.transportInfo.getStartTime();
      let endTime = this.transportInfo.getEndTime();
      this.queueIndex = 0;
      this.loopQueue = this.queue.filter(d => d.time >= startTime && d.time <= endTime);
    }));
  }

  private onTransportTime(transportTime: number): void {

    if (this.loopQueue.length > 0 && this.queueIndex < this.loopQueue.length) {
      let matches = 0;
      for (let i = this.queueIndex; i < this.queue.length; i++) {
        if (this.loopQueue[i].time === 0 || this.matches(transportTime, (this.loopQueue[i].time) / 1000, this.accuracy)) {
          matches++;
          this.instrument.play(new NoteTrigger(
            this.loopQueue[i].note,
            this.loopQueue[i].time,
            this.loopQueue[i].length,
            this.loopQueue[i].loudness,
            this.loopQueue[i].articulation));
        }
      }
      this.queueIndex += matches;
    }
  }

  private matches(val1: number, val2: number, accuracy: number): boolean {
    return Math.abs(val2 - val1) < accuracy;
  }

  addNote(note: string, time: number, length: number, loudness: number, articulation?: number): void {
    let insertIndex = _.sortedIndexBy(this.queue, {'time': time}, event => event.time);
    this.queue.splice(insertIndex, 0, {id:null,time:time,note:note,length:length,
      loudness:loudness,articulation:articulation,trackId:this.id});
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }




}
*/
