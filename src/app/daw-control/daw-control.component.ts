import {Component, Input, OnInit} from '@angular/core';

import {Project} from "../model/daw/Project";
import {TrackDto} from "../shared/api/TrackDto";

@Component({
  selector: 'daw-control',
  templateUrl: './daw-control.component.html',
  styleUrls: ['./daw-control.component.scss']
})
export class DawControlComponent implements OnInit {

  @Input() project: Project;

  constructor(
  ) {

  }

  ngOnInit() {
  }

  addMidiTrack(): void {
    this.project.model.tracks.push(new TrackDto())
    //this.projectsService.addTrack(this.project,this.project.tracks.length-1);
  }

}
