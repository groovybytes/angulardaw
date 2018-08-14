import {Component, DoCheck, Inject, Input, KeyValueDiffers, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProjectViewModel} from "../model/viewmodel/ProjectViewModel";
import {GridCellViewModel} from "../model/viewmodel/GridCellViewModel";
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
import {DefaultKeyValueDiffer} from "@angular/core/src/change_detection/differs/default_keyvalue_differ";
import {AppConfiguration} from "../app.configuration";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {System} from "../system/System";
import {Severity} from "../system/Severity";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";
import {ProjectsService} from "../shared/services/projects.service";

@Component({
  selector: 'project-watch',
  templateUrl: './project-watch.component.html',
  styleUrls: ['./project-watch.component.scss']
})
export class ProjectWatchComponent implements OnInit, OnChanges, DoCheck {

  @Input() tracks: Array<TrackViewModel>;

  private differ: any;

  constructor(private _differs: KeyValueDiffers,
              @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectViewModel>,
              private projectsService:ProjectsService,
              private system: System,
              private configuration: AppConfiguration) {
    this.differ = _differs.find([]).create();
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    /*let projectViewModel = <ProjectDto>changes.projectViewModel.currentValue;
    if (projectViewModel) {
      this.patterns = projectViewModel.patterns;
      this.gridCells = projectViewModel.grid.cells;
    }*/

  }

  ngDoCheck(): void {
    const change = <DefaultKeyValueDiffer<any, any>>this.differ.diff(this.tracks);
    if (change) {
      change.forEachAddedItem((item) => {
        console.log("pattern added!");
        /*item.currentValue.id = this.guid();*/

      })
    }

  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

}
