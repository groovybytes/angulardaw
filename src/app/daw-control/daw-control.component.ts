import {Component, Inject, Input, OnInit} from '@angular/core';

;
import {Project} from "../model/daw/Project";
import {TrackCategory} from "../model/daw/TrackCategory";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectDto} from "../shared/api/ProjectDTO";
import {TrackDto} from "../shared/api/TrackDto";
import {TrackMapper} from "../shared/api/mapping/TrackMapper";
import {System} from "../system/System";
import {ProjectsService} from "../shared/services/projects.service";

@Component({
  selector: 'daw-control',
  templateUrl: './daw-control.component.html',
  styleUrls: ['./daw-control.component.scss']
})
export class DawControlComponent implements OnInit {

  @Input() project: Project;

  constructor(
    private projectsService:ProjectsService
  ) {

  }

  ngOnInit() {
  }

  addMidiTrack(): void {
    this.projectsService.addMidiTrack(this.project);
  }

}
