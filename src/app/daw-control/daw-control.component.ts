import {Component, Input, OnInit} from '@angular/core';

import {Project} from "../model/daw/Project";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";

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

    //this.projectsService.addTrack(this.projectViewModel,this.projectViewModel.tracks.length-1);
  }

}
