import {Component, DoCheck, Inject, Input, KeyValueDiffers, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProjectDto} from "../shared/api/ProjectDto";
import {GridCellDto} from "../shared/api/GridCellDto";
import {Pattern} from "../model/daw/Pattern";
import {DefaultKeyValueDiffer} from "@angular/core/src/change_detection/differs/default_keyvalue_differ";
import {AppConfiguration} from "../app.configuration";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {System} from "../system/System";
import {Severity} from "../system/Severity";

@Component({
  selector: 'project-watch',
  templateUrl: './project-watch.component.html',
  styleUrls: ['./project-watch.component.scss']
})
export class ProjectWatchComponent implements OnInit, OnChanges, DoCheck {

  @Input() project: ProjectDto;
  @Input() gridCells: Array<GridCellDto>;
  @Input() patterns: Array<Pattern>;

  private differ: any;

  constructor(private _differs: KeyValueDiffers,
              @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
              private system: System,
              private configuration: AppConfiguration) {
    this.differ = _differs.find([]).create();
  }

  ngOnInit() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    /*let project = <ProjectDto>changes.project.currentValue;
    if (project) {
      this.patterns = project.patterns;
      this.gridCells = project.grid.cells;
    }*/

  }

  ngDoCheck(): void {
    /*const change = <DefaultKeyValueDiffer<any, any>>this.differ.diff(this.patterns);
    if (change) {
      change.forEachAddedItem((item) => {
        item.currentValue.id = this.guid();

      })
    }*/

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
