import {Subscription} from 'rxjs/internal/Subscription';
import * as _ from "lodash";
import {Instrument} from "../mip/instruments/Instrument";
import {EventDTO} from "../../shared/api/EventDTO";
import {Observable} from "rxjs/internal/Observable";


export class Track {
  id: any;
  index: number;
  name: string;
  instrument: Instrument;
  private subscriptions: Array<Subscription> = [];
  queue: Array<EventDTO> = [];
  private queueIndex: number = 0;
  private accuracy = 0.03;

  constructor() {

  }

  private onTransportTime(transportTime: number): void {
    if (this.queue.length > 0 && this.queueIndex < this.queue.length) {
      let matches = 0;
      for (let i = this.queueIndex; i < this.queue.length; i++) {
        if (this.queue[i].time === 0 || this.matches(transportTime, (this.queue[i].time) / 1000, this.accuracy)) {
          matches++;
          this.instrument.play(
            this.queue[i].note,
            this.queue[i].time,
            this.queue[i].length,
            this.queue[i].loudness,
            this.queue[i].articulation);
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
    this.queue.splice(insertIndex, 0, {
      id:null,
      note: note,
      time: time,
      length: length,
      loudness: loudness,
      articulation: articulation
    });
  }

  destroy() {
    this.subscriptions.forEach(subsription => subsription.unsubscribe());
  }
}
