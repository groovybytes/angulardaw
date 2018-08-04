import {Track} from "./Track";
import {TrackCategory} from "./TrackCategory";
import * as _ from "lodash";
import {EventDto} from "../../shared/api/EventDTO";
import {Subscription} from "rxjs/internal/Subscription";
import {ProjectDto} from "../../shared/api/ProjectDTO";
import {TrackDto} from "../../shared/api/TrackDTO";
import {Project} from "./Project";

export class MidiTrack extends Track {
  queue: Array<EventDto> = [];
  private loopQueue: Array<EventDto> = [];
  private queueIndex: number = 0;
  private accuracy = 0.03;
  private subscriptions: Array<Subscription> = [];

  constructor() {
    super();
    this.category = TrackCategory.MIDI;
  }

  protected onTransportInit(): void {
    this.subscriptions.push(this.transport.time.subscribe(time => this.onTransportTime(time)));
    this.subscriptions.push(this.transport.timeReset.subscribe(() => {
      let startTime = this.transport.getStartTime();
      let endTime = this.transport.getEndTime();
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
          this.instrument.play(
            this.loopQueue[i].note,
            this.loopQueue[i].time,
            this.loopQueue[i].length,
            this.loopQueue[i].loudness,
            this.loopQueue[i].articulation);
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
