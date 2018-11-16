import {Component, DoCheck, Input, KeyValueDiffers, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {DefaultKeyValueDiffer} from "@angular/core/src/change_detection/differs/default_keyvalue_differ";
import {Subscription} from "rxjs/internal/Subscription";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {TracksService} from "../../shared/services/tracks.service";

@Component({
  selector: 'project-observer',
  template: ''
})
export class ProjectObserverComponent implements DoCheck {

  @Input() project: Project;
  @Input() tracks: Array<Track>;

  private differ: any;

  private trackSoloSubscriptions: Array<{ id: string, subscription: Subscription }> = [];
  private trackTransportSubscriptions: Array<{ id: string, subscription: Subscription }> = [];

  constructor(private _differs: KeyValueDiffers, private tracksService: TracksService) {
    this.differ = _differs.find([]).create();
  }


  ngDoCheck(): void {
    const change = <DefaultKeyValueDiffer<any, any>>this.differ.diff(this.tracks);
    if (change) {
      change.forEachAddedItem((item) => {
        let track = item.currentValue as Track;
        let subscription = track.controlParameters.solo.subscribe(isSolo => {
          //this.tracksService.toggleSolo(this.project,track);
        });
        this.trackSoloSubscriptions.push({id: track.id, subscription: subscription});

        /*subscription = track.transport.beforeStart.subscribe(() => {
          this.project.metronomeTrack.transport.params = track.transport.params;
          this.project.metronomeTrack.transport.start();
        });
        this.trackTransportSubscriptions.push({id: track.id, subscription: subscription})
        subscription = track.transport.transportEnd.subscribe(() => {
          this.project.metronomeTrack.transport.stop();
        });*/
        this.trackTransportSubscriptions.push({id: track.id, subscription: subscription})

        this.project.trackAdded.emit(track);


      });
      change.forEachRemovedItem((item) => {
        let track = item.currentValue as Track;
        let index = this.trackSoloSubscriptions.findIndex(d => d.id === track.id);
        if (index >= 0) {
          this.trackSoloSubscriptions[index].subscription.unsubscribe();
          this.trackSoloSubscriptions.splice(index, 1);
        }
        index = this.trackTransportSubscriptions.findIndex(d => d.id === track.id);
        if (index >= 0) {
          this.trackTransportSubscriptions[index].subscription.unsubscribe();
          this.trackTransportSubscriptions.splice(index, 1);
        }

        this.project.trackRemoved.emit(track);
      })
    }

  }

}
