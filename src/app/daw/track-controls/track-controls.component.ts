import {Component, Input, OnInit} from '@angular/core';
import {Track} from "../model/daw/Track";
import {Project} from "../model/daw/Project";
import {TracksService} from "../shared/services/tracks.service";
import { Options } from 'ng5-slider';
import {SimpleSliderModel} from "../model/daw/visual/SimpleSliderModel";



@Component({
  selector: 'track-controls',
  templateUrl: './track-controls.component.html',
  styleUrls: ['./track-controls.component.scss']
})
export class TrackControlsComponent implements OnInit {

  @Input() project:Project;
  @Input() track:Track;

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

  changeGain(gain:any):void{

    this.track.controlParameters.gain.next(gain.value);
  }

  mute():void{
    this.track.controlParameters.mute.next(!this.track.controlParameters.mute.getValue());
  }

  solo():void{
    this.tracksService.toggleSolo(this.project,this.track);

  }

}
