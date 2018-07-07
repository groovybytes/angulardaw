import {AngularDawService} from "../services/angular-daw.service";
import {Sample} from "../model/Sample";
import {TransportService} from "./transport.service";
import {Injectable} from "@angular/core";
import {AudioContextService} from "./audiocontext.service";
import {TimeSignature} from "../model/theory/TimeSignature";
import {SamplesService} from "./samples.service";
import {Dynamics} from "../model/theory/Dynamics";
import {Note} from "../model/theory/Note";

@Injectable()
export class MetronomeService{
  get running(): boolean {
    return this.transport.running;
  }

  private click1:Sample;
  private click2:Sample;

  get signature(): TimeSignature {
    return this.transport.signature;
  }

  set signature(value: TimeSignature) {
    this.transport.signature=value;
  }

  get bpm(): number {
    return this.transport.bpm;
  }

  set bpm(value: number) {
    this.transport.bpm=value;
  }

  //private _signature: TimeSignature = new TimeSignature(4, 4);

  private _running:boolean;
  constructor(protected dawService: AngularDawService,
              private sampleService:SamplesService,
              private audioContext:AudioContextService,
              private transport:TransportService) {

    this.sampleService.getSamples(["/assets/sounds/metronome/click2.wav", "/assets/sounds/metronome/click3.wav"]).then(result=>{
      debugger;
      this.click1=result[0];
      this.click2=result[1];
    });

    this.transport.beat.subscribe(position=>{
      if (position.beat===0) this.click2.play(0,0.5,[Note.get("A2")],Dynamics.default());
        else this.click1.play(0,0.5,[Note.get("A2")],Dynamics.default());
    })
  }


  start():void{
    this.transport.start();
  }
  stop():void{
    this.transport.stop();
  }
}
