import {Component, ElementRef, HostBinding, Input} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {MetronomeService} from "../../services/metronome.service";
import {TimeSignature} from "../../model/theory/TimeSignature";
import {TransportService} from "../../services/transport.service";

@Component({
  selector: 'daw-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss'],
  providers: [MetronomeService,TransportService]
})
export class MetronomeComponent extends DawPlugin {

  @HostBinding('class')
  elementClass = 'plugin';

  @Input('_bpm')
  get bpm(): number {
    return this.metronome.bpm;
  }

  set bpm(value: number) {
    this.metronome.bpm = value;
  }

  @Input('minBpm') minBpm: number = 40;
  @Input('maxBpm') maxBpm: number = 300;
  @Input('_beatUnit')

  get beatUnit(): number {
    return this.metronome.signature.beatUnit;
  }
  set beatUnit(value: number) {
    this.metronome.signature = new TimeSignature(value, this.barUnit);
  }
  @Input('_barUnit')
  get barUnit(): number {
    return this.metronome.signature.barUnit;
  }
  set barUnit(value: number) {
    this.metronome.signature = new TimeSignature(this.beatUnit, value);
  }



  constructor(protected dawService: AngularDawService, private metronome: MetronomeService) {

    super(dawService);
  }


  start(): void {
    this.metronome.start();
  }

  pause(): void {
    this.metronome.stop();
  }

  stop(): void {
    this.metronome.stop();
  }

  increase(value:number):void{
    let newBpm = this.metronome.bpm+value;
    if (newBpm >= this.minBpm && newBpm <= this.maxBpm) this.metronome.bpm=newBpm;
  }


  id(): string {
    return "metronome";
  }

  title(): string {
    return "metronome";
  }

  activate(): void {
  }

  destroy(): void {
  }


}
