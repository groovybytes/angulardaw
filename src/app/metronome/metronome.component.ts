import {Component, HostBinding, Inject, Input, OnInit} from '@angular/core';
import {SamplesApi} from "../api/samples.api";
import {Subscription} from "rxjs/internal/Subscription";
import {Workstation} from "../model/daw/Workstation";
import {Clicker} from "../model/daw/Clicker";
import {Project} from "../model/daw/Project";
import {NoteLength} from "../model/mip/NoteLength";

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

  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  private transportSubscription: Subscription;

  constructor(@Inject("workstation") private workstation:Workstation,private samplesApi:SamplesApi) {

  }

  onStartBtnToggled(value: boolean): void {
    if (this.project.transport.running) this.project.transport.stop();
    else this.project.transport.start();
  }

  pause(): void {
    this.project.transport.pause();
  }

  increase(value: number): void {
    let newBpm = this.project.bpm + value;
    if (newBpm >= this.minBpm && newBpm <= this.maxBpm) this.project.bpm = newBpm;
  }

  activate(): void {

  }

  destroy(): void {
    this.transportSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.project=this.workstation.createProject();
    this.project.quantization=NoteLength.EighthTriplet;
    this.samplesApi.getClickSamples().then(result=>{
      this.clicker = new Clicker(result.accentSample,result.defaultSample);
    });
    this.transportSubscription = this.project.transport.beat.subscribe(beat => {
      this.clicker.click(beat===0);
    });
  }


}
