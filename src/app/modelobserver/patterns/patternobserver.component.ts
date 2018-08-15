import {Component, DoCheck, Input, KeyValueDiffers, OnChanges, SimpleChanges} from '@angular/core';
import {PatternViewModel} from "../../model/viewmodel/PatternViewModel";
import {DefaultKeyValueDiffer} from "@angular/core/src/change_detection/differs/default_keyvalue_differ";
import {ProjectsService} from "../../shared/services/projects.service";
import {NoteTriggerViewModel} from "../../model/viewmodel/NoteTriggerViewModel";
import {Track} from "../../model/daw/Track";
import {Project} from "../../model/daw/Project";

import {TransportService} from "../../shared/services/transport.service";

@Component({
  selector: 'pattern-observer',
  template: ''
})
export class PatternObserverComponent implements DoCheck, OnChanges {

  @Input() project: Project;
  @Input() pattern: PatternViewModel;
  @Input() track: Track;

  private differ: any;
  private subjectToObserve: Array<NoteTriggerViewModel>;

  constructor(private _differs: KeyValueDiffers, private transportService: TransportService
    , private projectsService: ProjectsService) {
    this.differ = _differs.find([]).create();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern && changes.pattern.currentValue) {
      this.subjectToObserve = this.pattern.events;
      this.projectsService.onPatternChanged(this.track, this.pattern, this.transportService.params);
    }
  }

  ngDoCheck(): void {
   /* const change = <DefaultKeyValueDiffer<any, any>>this.differ.diff(this.subjectToObserve);
    if (change) {

      change.forEachAddedItem((item) => {
        console.log(item);
        this.track.addEvent(item.currentValue);
      });
      change.forEachRemovedItem((item) => {
        this.track.removeEvent(item.previousValue.id);
      })
    }*/

  }
}

