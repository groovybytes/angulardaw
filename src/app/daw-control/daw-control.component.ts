import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Project} from "../model/daw/Project";
import {TrackViewModel} from "../model/viewmodel/TrackViewModel";
import {NoteLength} from "../model/mip/NoteLength";
import {TransportService} from "../shared/services/transport.service";

@Component({
  selector: 'daw-control',
  templateUrl: './daw-control.component.html',
  styleUrls: ['./daw-control.component.scss']
})
export class DawControlComponent implements OnInit {

  @Input() project: Project;

  constructor(private transportService:TransportService) {

  }

  ngOnInit() {
  }

  setQuantization(value:number):void{
    this.project.model.quantization=value;
    this.transportService.params.quantization.next(value);
  }

  addMidiTrack(): void {

    //this.projectsService.addTrack(this.projectViewModel,this.projectViewModel.tracks.length-1);
  }

}
