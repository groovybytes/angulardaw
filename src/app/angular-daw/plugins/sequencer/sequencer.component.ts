import {Component, ElementRef, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {TransportService} from "../../services/transport.service";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  providers:[TransportService]
})
export class SequencerComponent extends DawPlugin implements OnInit, OnDestroy {

  @HostBinding('class')
  elementClass = 'plugin';
  activated: boolean = false;
  constructor(
    protected dawService: AngularDawService) {
    super(dawService);
  }

  ngOnInit() {
   //this.metronome=new Metronome(this.dawService,this.audioContext);

  }

  startRecord():void{

  }
  stop():void{

  }

  ngOnDestroy(): void {
  }

  id(): string {
    return "sequencer";
  }

  title(): string {
    return "sequencer";
  }

  activate(): void {
    this.activated = true;
  }

  destroy(): void {
  }



}




