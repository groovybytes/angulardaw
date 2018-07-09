import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {TimeSignature} from "../../model/theory/TimeSignature";
import {TransportService} from "../../services/transport.service";
import {Note} from "../../model/theory/Note";
import {Dynamics} from "../../model/theory/Dynamics";
import {SamplesV2Service} from "../../services/samplesV2.service";
import {AppConfiguration} from "../../../app.configuration";
import {Sample} from "../../model/Sample";
import {Subscription} from "rxjs/internal/Subscription";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {System} from "../../../system/System";

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

  active: BehaviorSubject<boolean>;

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


  start(): void {
    this.transport.start();
  }

  pause(): void {
    this.transport.pause();
  }

  stop(): void {
    this.transport.stop();
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
        if (position.beat === 0) this.click2.play(0, 0.5, [Note.get("A2")], Dynamics.default());
        else this.click1.play(0, 0.5, [Note.get("A2")], Dynamics.default());

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
