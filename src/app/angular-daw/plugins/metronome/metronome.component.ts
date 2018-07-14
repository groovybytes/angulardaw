import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {TransportService} from "../../services/transport.service";
import {SamplesV2Service} from "../../services/samplesV2.service";
import {AppConfiguration} from "../../../app.configuration";
import {Sample} from "../../model/Sample";
import {Subscription} from "rxjs/internal/Subscription";
import {System} from "../../../system/System";
import {TimeSignature} from "../../model/mip/TimeSignature";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  providers: [TransportService]
})
export class MetronomeComponent extends DawPlugin implements OnInit {

  @HostBinding('class')
  elementClass = 'plugin';


  @Input('_bpm')
  get bpm(): number {
    return this.transport.bpm;
  }

  set bpm(value: number) {
    this.transport.bpm = value;
  }

  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  @Input('_beatUnit')
  get beatUnit(): number {
    return this.transport.signature.beatUnit;
  }

  set beatUnit(value: number) {
    this.transport.signature = new TimeSignature(value, this.barUnit);
  }

  @Input('_barUnit')
  get barUnit(): number {
    return this.transport.signature.barUnit;
  }

  set barUnit(value: number) {
    this.transport.signature = new TimeSignature(this.beatUnit, value);
  }

  get running(): boolean {
    return this.transport.running;
  }

  private click1: Sample;
  private click2: Sample;
  private transportSubscription: Subscription;

  constructor(
    protected dawService: AngularDawService,
    private sampleService: SamplesV2Service,
    private system: System,
    private config: AppConfiguration,
    private transport: TransportService) {

    super(dawService);

  }

  onStartBtnToggled(value:boolean):void{
    if (this.transport.running) this.transport.stop();
    else  this.transport.start();
  }

  pause(): void {
    this.transport.pause();
  }
  increase(value: number): void {
    let newBpm = this.bpm + value;
    if (newBpm >= this.minBpm && newBpm <= this.maxBpm) this.bpm = newBpm;
  }


  id(): string {
    return "metronome";
  }

  title(): string {
    return "metronome";
  }

  activate(): void {
    this.sampleService.getSamples([
      this.config.getAssetsUrl("sounds/metronome/click1.wav"),
      this.config.getAssetsUrl("sounds/metronome/click2.wav")]).then(result => {

      this.click1 = result[0];
      this.click2 = result[1];
      this.transportSubscription = this.transport.beat.subscribe(position => {
        if (position.beat === 0) this.click2.trigger();// play(0, 0.5, [NoteInfo.get("A2")], Dynamics.default());
        else this.click1.trigger();

      })
    }).catch(error => {

      this.system.error(error);
    })
  }

  destroy(): void {
    this.transportSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.dawService.register(this);
  }

  defaultWidth(): number {
    return 600;
  }

  defaultHeight(): number {
    return 600;
  }


}
