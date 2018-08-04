import {Component, Inject, Input, OnInit} from '@angular/core';

;
import {Project} from "../model/daw/Project";
import {TrackCategory} from "../model/daw/TrackCategory";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectDto} from "../shared/api/ProjectDTO";
import {TrackDto} from "../shared/api/TrackDto";
import {TrackMapper} from "../shared/api/mapping/TrackMapper";
import {System} from "../system/System";

@Component({
  selector: 'daw-control',
  templateUrl: './daw-control.component.html',
  styleUrls: ['./daw-control.component.scss']
})
export class DawControlComponent implements OnInit {

  @Input() project: Project;

  constructor(
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    @Inject("TracksApi") private tracksApi: ApiEndpoint<TrackDto>,
    private system: System
  ) {

  }

  ngOnInit() {
  }

  addMidiTrack(): void {
    let track = this.project.newTrack(TrackCategory.MIDI);
    this.tracksApi.post(TrackMapper.toJSON(this.project.id, track))
      .subscribe(result => {
        console.log("track saved");
      }, error => this.system.error(error));

  }

}
