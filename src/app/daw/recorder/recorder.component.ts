import {Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Pattern} from "../model/daw/Pattern";
import {WstPlugin} from "../model/daw/plugins/WstPlugin";
import {Subscription} from "rxjs";
import {Project} from "../model/daw/Project";
import {PatternsService} from "../shared/services/patterns.service";
import {NoteTrigger} from "../model/daw/NoteTrigger";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportContext} from "../model/daw/transport/TransportContext";
import {TimeSignature} from "../model/mip/TimeSignature";
import {AudioContextService} from "../shared/services/audiocontext.service";

@Component({
  selector: 'recorder',
  template: ''
})
export class RecorderComponent implements OnInit, OnDestroy, OnChanges {

  @Input() project: Project;

  private metronomeTransport: TransportContext;
  private recordActive: boolean = false;
  private pattern: Pattern;
  private patternSubscription: Subscription;
  private recordTime: number;

  constructor(private audioContext: AudioContextService, private patternsService: PatternsService) {
    /* this.subscriptions.push(project.inputDevice.noteStart.subscribe(event => this.recordNoteStart(event)));
     this.subscriptions.push(project.inputDevice.noteEnd.subscribe(() => this.recordNoteEnd()));*/
  }

  ngOnInit() {
    this.metronomeTransport = this.project.metronomePattern.transportContext;
    this.project.recordNoteStart.subscribe((trigger: NoteTrigger) => {

      if (this.recordActive){
        trigger.time = this.recordTime*1000;
        trigger.length = 200;
        trigger.loudness = 1;
        this.pattern.insertNote(trigger,true);
      }

    });
    this.project.recordNoteEnd.subscribe(() => {
      if (this.recordActive){

      }
    });
    this.project.record.subscribe((pattern: Pattern) => {
      if (this.recordActive) {
        this.recordActive = false;
        this.patternsService.stopAndClear(this.project);
        this.patternSubscription.unsubscribe();
      }
      else {
        this.project.setChannels([]);
        this.project.start();
        this.pattern = pattern;
        let metronomeSubscription = this.metronomeTransport.time.subscribe(event => {

          if (event != null) {
            let bar = MusicMath.getBarNumber(
              event.value * 1000,
              this.metronomeTransport.settings.global.bpm,
              this.project.metronomePattern.quantization.getValue(),
              new TimeSignature(this.metronomeTransport.settings.global.beatUnit, this.metronomeTransport.settings.global.barUnit));
            if (bar === 1) {
              metronomeSubscription.unsubscribe();
              this.pattern.stream.setTimeOffset(event.value);
              this.project.addChannel(this.pattern.id);
              let patternTime = MusicMath.getEndTime(this.pattern.transportContext.settings.loopEnd,this.pattern.transportContext.settings.global.bpm)/1000;
              this.patternSubscription = this.pattern.transportContext.time.subscribe(event => {
                this.recordTime = (event.value-this.pattern.stream.transportTimeOffset) % patternTime;
              });
              // this.patternsService.stopAndClear(this.project);
              //this.patternsService.togglePattern(this.pattern.id, this.project);

              //this.project.transport.resetStartTime();
              /* */
              this.recordActive = true;
            }

          }

        });
        //this.patternsService.togglePattern(this.project.metronomePattern.id, this.project);

      }

    });

  }

  /*ngOnInit() {
    this.metronomeTransport = this.project.metronomePattern.transportContext;
    this.project.recordNoteStart.subscribe((trigger: NoteTrigger) => {
      console.log(trigger);
    });
    this.project.recordNoteEnd.subscribe(() => {

    });
    this.project.record.subscribe((pattern: Pattern) => {
      if (this.recordActive){
        this.recordActive=false;
        this.patternsService.stopAndClear(this.project);
      }
      else{
        this.pattern = pattern;
        this.project.metronomePattern.transportContext.settings.loop=false;
        this.project.metronomePattern.transportContext.settings.loopEnd=5;
        this.metronomeTransport.transportEnd.subscribe(()=>{
          console.log("end");
        })
        let metronomeSubscription = this.metronomeTransport.time.subscribe(event => {
          if (event != null) {
          /!*  let beat = MusicMath.getBeatNumber(
              event.value * 1000,
              this.metronomeTransport.settings.global.bpm,
              this.project.metronomePattern.quantization.getValue(),
              new TimeSignature(this.metronomeTransport.settings.global.beatUnit, this.metronomeTransport.settings.global.barUnit));
            let bar = MusicMath.getBarNumber(
              event.value * 1000,
              this.metronomeTransport.settings.global.bpm,
              this.project.metronomePattern.quantization.getValue(),
              new TimeSignature(this.metronomeTransport.settings.global.beatUnit, this.metronomeTransport.settings.global.barUnit));*!/
           /!* if (beat === 1) {
              metronomeSubscription.unsubscribe();
              this.patternsService.stopAndClear(this.project);
              this.patternsService.togglePattern(this.pattern.id, this.project);

              //this.project.transport.resetStartTime();
              /!* this.project.addChannel(this.pattern.id);*!/
              this.recordActive = true;
            }*!/

          }

        });
        this.patternsService.togglePattern(this.project.metronomePattern.id, this.project);
        /!*this.project.setChannels([]);
        this.project.start();*!/
      }

    });

  }*/

  start(pattern: Pattern): void {
    this.patternsService.togglePattern(pattern.id, this.project);
  }

  private recordNoteStart(event: { note: string }): void {
    //this.plugin.feed(new NoteTrigger(null, event.note), 0);
  }

  private recordNoteEnd(): void {
    console.log("end");
  }

  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
