import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {Clicker} from "../model/daw/Clicker";
import {Project} from "../model/daw/Project";
import {NoteLength} from "../model/mip/NoteLength";
import {TransportService} from "../shared/services/transport.service";
import {ProjectsService} from "../shared/services/projects.service";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  providers: [TransportService]
})

export class MetronomeComponent implements OnInit {

  @HostBinding('class')
  elementClass = 'plugin';
  private clicker:Clicker;

  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  transport:TransportService;
  private project:Project;
  private transportSubscription: Subscription;

  constructor( transport:TransportService,private projectService:ProjectsService) {
    this.transport=transport;
  }

  onStartBtnToggled(value: boolean): void {
    if (this.transport.isRunning()) this.transport.stop();
    else this.transport.start();
  }

  pause(): void {
    this.transport.pause();
  }

  increase(value: number): void {
    let newBpm = this.transport.params.bpm + value;
    if (newBpm >= this.minBpm && newBpm <= this.maxBpm) this.transport.params.bpm = newBpm;
  }

  activate(): void {

  }

  destroy(): void {
    this.transportSubscription.unsubscribe();
  }

  ngOnInit(): void {

    this.projectService.loadGhostProject({
      id:0,
      name:"metronome",
      bpm:120,
      quantization:NoteLength.Quarter,
      signature:"4,4"
    }).then(result=>this.project=result);

    this.transport.params.quantization=NoteLength.EighthTriplet;
    this.projectService.addClickTrack(this.project);
  }


}
