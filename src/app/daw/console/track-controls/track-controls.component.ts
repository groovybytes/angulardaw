import {Component, Input, OnInit} from '@angular/core';

import { Options } from 'ng5-slider';
import {Project} from "../../model/daw/Project";
import {SimpleSliderModel} from "../../model/daw/visual/SimpleSliderModel";
import {Track} from "../../model/daw/Track";
import {TracksService} from "../../shared/services/tracks.service";


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
