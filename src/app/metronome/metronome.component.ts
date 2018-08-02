import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {SamplesApi} from "../api/samples.api";
import {Subscription} from "rxjs/internal/Subscription";
import {WorkstationService} from "../shared/services/workstation.service";
import {Clicker} from "../model/daw/Clicker";
import {Project} from "../model/daw/Project";
import {NoteLength} from "../model/mip/NoteLength";
import {Transport} from "../model/daw/Transport";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})

export class MetronomeComponent implements OnInit {

  @HostBinding('class')
  elementClass = 'plugin';
  private clicker:Clicker;
  project:Project;

  @Input() transport:Transport;
  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  private transportSubscription: Subscription;

  constructor(private workstation:WorkstationService, private samplesApi:SamplesApi) {

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

    this.transport.params.quantization=NoteLength.EighthTriplet;
    this.samplesApi.getClickSamples().then(result=>{
      this.clicker = new Clicker(result.accentSample,result.defaultSample);
    });
    this.transportSubscription = this.transport.beat.subscribe(beat => {
     // this.clicker.click(beat===0);
    });
  }


}
