import {Component, Input, OnInit} from '@angular/core';

import {Project} from "../model/daw/Project";
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
    this.projectsService.addTrack(this.project,this.project.tracks.length-1);
  }

}
