import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {SamplesApi} from "../../api/samples.api";
import {Subscription} from "rxjs/internal/Subscription";
import {Workstation} from "../../model/daw/Workstation";
import {Clicker} from "../../model/daw/Clicker";
import {Project} from "../../model/daw/Project";
import {NoteLength} from "../../model/mip/NoteLength";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})

export class MetronomeComponent extends DawPlugin implements OnInit {

  @Input() workstation: Workstation;

  @HostBinding('class')
  elementClass = 'plugin';
  private clicker:Clicker;
  //private _bpm: number;

  project:Project;
 /* @Input('bpm')
  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = value;
    this.project.transport.tickInterval = MusicMath.getBeatTime(value);
  }
*/
  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  /*private _signature: TimeSignature = new TimeSignature(4, 4);
  @Input('signature')
  get signature(): TimeSignature {
    return this._signature;
  }*/

  /*set signature(value: TimeSignature) {
    this._signature = value;
  }
*/
  /*get running(): boolean {
    return this.project.transport.running;
  }*/

 /* private transport:Scheduler;*/

  private transportSubscription: Subscription;

  constructor(private samplesApi:SamplesApi) {

    super();
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


  id(): string {
    return "metronome";
  }

  title(): string {
    return "metronome";
  }

  activate(): void {
    this.project=this.workstation.createProject();
    this.project.quantization=NoteLength.EighthTriplet;
    this.samplesApi.getClickSamples().then(result=>{
      this.clicker = new Clicker(result.accentSample,result.defaultSample);
    });
    this.transportSubscription = this.project.transport.beat.subscribe(beat => {
      this.clicker.click(beat===0);
    });
  }

  destroy(): void {
    this.transportSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.workstation.register(this);
  }

  defaultWidth(): number {
    return 600;
  }

  defaultHeight(): number {
    return 600;
  }


}
