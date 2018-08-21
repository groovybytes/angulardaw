import {Component, Input, OnInit} from '@angular/core';

import {Project} from "../model/daw/Project";
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
    this.project.quantization=value;
    this.transportService.params.quantization.next(value);

  }

  setBpm(value:number):void{
    this.project.bpm=value;
    this.transportService.params.bpm.next(value);
  }

  switchMetronome():void{
    this.project.metronomeEnabled=! this.project.metronomeEnabled;
  }

  addMidiTrack(): void {

    //this.projectsService.addTrack(this.projectViewModel,this.projectViewModel.tracks.length-1);
  }

}
