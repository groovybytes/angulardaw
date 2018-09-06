import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {SimpleSliderModel} from "../model/daw/visual/SimpleSliderModel";
import {Track} from "../model/daw/Track";
import {TracksService} from "../shared/services/tracks.service";

@Component({
  selector: 'console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  @Input() project:Project;

  slider: SimpleSliderModel = {
    value: 50,
    options: {
      floor: 0,
      ceil: 100,
      vertical: true,
      showSelectionBar: true
    }
  };

  constructor(private tracksService:TracksService) { }

  ngOnInit() {
  }

  changeGain(gain:any,track:Track):void{

    track.controlParameters.gain.next(gain.value);
  }

  mute(track:Track):void{
    track.controlParameters.mute.next(!track.controlParameters.mute.getValue());
  }

  solo(track:Track):void{
    this.tracksService.toggleSolo(this.project,track);

  }

}
