/*
import {Transport} from "./transport/Transport";
import {Track} from "./Track";
import {Pattern} from "./Pattern";
import {Subscription} from "rxjs";
import {Project} from "./Project";

export class Scene {

  patterns: Array<{ track: Track, pattern: Pattern }>;
  private subscriptions: Array<Subscription> = [];

  constructor(private transport: Transport,  patterns: Array<{ track: Track, pattern: Pattern }>) {

  /!*  let subscription = project.trackAdded.subscribe(track => {
      this.patterns.push({track: track, pattern: null});

    });
    this.subscriptions.push(subscription);
    subscription = project.trackRemoved.subscribe(track => {
      let deleteIndex = this.patterns.findIndex(pattern => pattern.track.id === track.id);
      if (deleteIndex >= 0) this.patterns.splice(deleteIndex, 1);
    });
    this.subscriptions.push(subscription);*!/
  }

  start(): void {
    this.transport.start();
  }

  stop(): void {
    this.transport.stop();
  }

  destroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());

  }
}
*/
