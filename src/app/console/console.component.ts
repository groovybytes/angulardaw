import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {Track} from "../model/daw/Track";
import {TracksService} from "../shared/services/tracks.service";

@Component({
  selector: 'daw-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  @Input() project: Project;
  @Input() track: Track;

  constructor(private tracksService: TracksService) {
  }

  ngOnInit() {
    console.log(this.track.controlParameters.gain);
  }


  changeGain(gain: number): void {
    this.track.controlParameters.gain.next(gain);
  }

  mute(): void {
    this.track.controlParameters.mute.next(!this.track.controlParameters.mute.getValue());
  }

  solo(): void {
    this.tracksService.toggleSolo(this.project, this.track);

  }

  arm(): void {
    this.track.controlParameters.record.next(!this.track.controlParameters.record.getValue());

  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    return value;
  }


}
