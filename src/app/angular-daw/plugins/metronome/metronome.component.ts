import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {TransportService} from "../../services/transport.service";
import {SamplesV2Service} from "../../services/samplesV2.service";
import {AppConfiguration} from "../../../app.configuration";
import {Subscription} from "rxjs/internal/Subscription";
import {System} from "../../../system/System";
import {TimeSignature} from "../../model/mip/TimeSignature";
import {MusicMath} from "../../model/utils/MusicMath";
import {ClickerService} from "../../services/clicker.service";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  providers: [TransportService]
})
export class MetronomeComponent extends DawPlugin implements OnInit {

  @HostBinding('class')
  elementClass = 'plugin';


  private _bpm: number;
  @Input('bpm')
  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = value;
    this.transport.tickInterval = MusicMath.getBeatTime(value);
  }

  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;

  private _signature: TimeSignature = new TimeSignature(4, 4);
  @Input('signature')
  get signature(): TimeSignature {
    return this._signature;
  }

  set signature(value: TimeSignature) {
    this._signature = value;
  }

  get running(): boolean {
    return this.transport.running;
  }

  private transportSubscription: Subscription;

  constructor(
    protected dawService: AngularDawService,
    private sampleService: SamplesV2Service,
    private system: System,
    private config: AppConfiguration,
    private clicker: ClickerService,
    private transport: TransportService) {

    super(dawService);

  }

  onStartBtnToggled(value: boolean): void {
    if (this.transport.running) this.transport.stop();
    else this.transport.start();
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
    this.clicker.bootstrap();

    this.transportSubscription = this.transport.tick.subscribe(position => {
      this.clicker.click(MusicMath.getBeatNumber(position.tick, this._signature) === 0);
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
