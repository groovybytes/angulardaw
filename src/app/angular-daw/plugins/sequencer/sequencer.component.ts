import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {DawPlugin} from "../DawPlugin";
import {AngularDawService} from "../../services/angular-daw.service";
import {TransportService} from "../../services/transport.service";
import {NoteInfo} from "../../model/utils/NoteInfo";
import {Dynamics} from "../../model/utils/Dynamics";
import {SamplesV2Service} from "../../services/samplesV2.service";
import {System} from "../../../system/System";
import {AppConfiguration} from "../../../app.configuration";
import {SimpleDrum} from "../../model/drums/SimpleDrum";
import $ from 'jquery/dist/jquery';
import {Sample} from "../../model/Sample";
import {ADSREnvelope} from "../../model/mip/ADSREnvelope";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss'],
  providers: [TransportService]
})
export class SequencerComponent extends DawPlugin implements OnInit, OnDestroy,AfterViewInit {


  private reverb:Sample;

  ngAfterViewInit(): void {

    let component=$(this.element.nativeElement);

    let defaultGainCurve = [0.1,0.2,0.5,1];
    let defaultDynamics = new Dynamics(0,0,0,0,defaultGainCurve);
    $(window).keydown((event)=> {
      console.log(event);
      if (event.which===32) this.drum.kick.triggerWith(ADSREnvelope.default(),this.reverb);
      else if (event.which===71) this.drum.snare.triggerWith(ADSREnvelope.default(),this.reverb);
      else if (event.which===8) this.drum.hihat.triggerWith(ADSREnvelope.default(),this.reverb);

      return false;
    });


  }

  @HostBinding('class')
  elementClass = 'plugin';
  activated: boolean = false;
  private drum:SimpleDrum;

  constructor(
    private element:ElementRef,
    private samplesV2Service: SamplesV2Service,
    private system: System,
 /*   @Inject('jquery') private $:JQueryStatic,*/
    private config: AppConfiguration,
    protected dawService: AngularDawService) {
    super(dawService);
  }


  onContextMenu(ev):void{
    ev.preventDefault();
    this.drum.snare.trigger()
  }
  drumBtnClick(ev):void{
    ev.stopPropagation();
    ev.preventDefault();
    this.drum.kick.trigger();

  }
  ngOnInit(): void {
    this.dawService.register(this);
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

    let samples = [
      this.config.getAssetsUrl("sounds/drums/drumkit1/kick.wav"),
      this.config.getAssetsUrl("sounds/drums/drumkit1/snare.wav"),
      this.config.getAssetsUrl("sounds/drums/drumkit1/hihat.wav")
    ]
    this.samplesV2Service.getSamples(samples).then(result => {
      let drum = this.drum=new SimpleDrum();
      drum.kick = result[0];
      drum.snare = result[1];
      drum.hihat = result[2];

    }, error => this.system.error(error));

    this.samplesV2Service.getSamples([ this.config.getAssetsUrl("sounds/impulses/PlateMedium.wav")]).then(result => {
      this.reverb=result[0];

    }, error => this.system.error(error));
  }

  playKick():void{
    this.drum.kick.triggerWith(ADSREnvelope.default(),this.reverb);
  }
  destroy(): void {
  }

  defaultWidth(): number {
    return 600;
  }

  defaultHeight(): number {
    return 600;
  }

}




