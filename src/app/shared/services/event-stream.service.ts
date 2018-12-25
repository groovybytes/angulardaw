import {Inject, Injectable} from '@angular/core';
import {DawInfo} from "../../model/DawInfo";
import {Subscription} from "rxjs";
import {Thread} from "../../model/daw/Thread";
import {Pattern} from "../../model/daw/Pattern";
import {SampleEventInfo} from "../../model/daw/SampleEventInfo";
import {MusicMath} from "../../model/utils/MusicMath";
import {AudioContextService} from "./audiocontext.service";
import {NoteLength} from "../../model/mip/NoteLength";
import {filter} from "rxjs/operators";
import {Sample} from "../../model/daw/Sample";

@Injectable({
  providedIn: 'root'
})
export class EventStreamService {

  private ticker: Thread;
  private subscriptions: Array<Subscription> = [];
  private isRunning: boolean = false;
  private loop: boolean = false;
  private audioContext: AudioContext;
  patterns: Array<Pattern>;

  constructor(@Inject("daw") private daw: DawInfo, private audioContextService: AudioContextService) {
    this.audioContext = audioContextService.getAudioContext();
  }


  start(): void {
    if (this.isRunning) {
      this.stop();
    } else {
      this.isRunning = true;
      this.loop = true;
      this.debug("start");
      let project = this.daw.project.getValue();
      //this.ticker = project.threads.find(t => t.id === "ticker");
      /*this.ticker.post(
        {
          command: "set-interval"
          , params: MusicMath.getTickTime(project.transport.settings.global.bpm, NoteLength.Quarter)
        });
*/
     /* this.subscriptions.push(this.ticker.error.subscribe(error => console.error(error)));
      this.subscriptions.push(this.ticker.message.subscribe(tick => {
        //this.debug((tick.data % project.transport.settings.global.beatUnit) + 1);
      }));*/

      let loopBars = 0;


      let patterns: Array<Pattern> = this.patterns = [];
      this.debug("channels: " + project.transport.channels);
      project.transport.channels.forEach(channel => {
        let pattern = project.patterns.find(pattern => pattern.id === channel);
        if (pattern) {
          patterns.push(pattern);
          /*this.subscriptions.push(this.ticker.message
            .pipe(filter(event =>  {

            }))
            .subscribe(event => ));*/
        }
      });
      patterns.push(project.metronomePattern);

      patterns.forEach(pattern => {
        if (pattern.getLengthInBars() > loopBars) loopBars = pattern.getLengthInBars();
      });

      let loopLength = MusicMath.getLength(
        loopBars,
        project.transport.settings.global.bpm,
        project.transport.settings.global.beatUnit);

      this.debug("loop length " + loopLength);

      let startTime:number;

      this.subscriptions.push(Sample.onEnd.subscribe((event:{relatedEvent:SampleEventInfo,sample:Sample}) => {
        if (this.loop) {
          event.relatedEvent.loopsPlayed++;
          event.sample.trigger(event.relatedEvent);
        }
      }));


      let startPromise=new Promise<void>((resolve)=>{
        patterns.forEach(pattern => {
          pattern.events.forEach(event => {
            let sampleEvent = new SampleEventInfo(event.note);
            sampleEvent.note = event.note;
            sampleEvent.time = event.time / 1000;
            sampleEvent.loopLength = pattern.getLength() / 1000;
            sampleEvent.getOffset = ()=> startTime+sampleEvent.loopLength*sampleEvent.loopsPlayed;
            let sample = pattern.plugin.getSample(event.note);
            sample.trigger(sampleEvent,startPromise);
          });
          startTime = this.audioContext.currentTime;
          resolve();

        });
      });



      //this.ticker.post({command:"start"});
    }

  }


  /* private triggerEvents(loopLength: number, bpm: number, patterns: Array<Pattern>): void {


     //let startTime = MusicMath.getStartTime(this.transportContext.settings.loopStart, this.transportContext.settings.global.bpm);
     let endTime = MusicMath.getEndTime(loopLength, bpm);
     let timeFactor = 120 / bpm;


   }

   pingPattern(nextTime: number, bar: number, pattern: Pattern, force?: boolean): void {
     pattern.getLengthInBars();

     if (force) {
       pattern.events.forEach(event => {
         let sampleEvent = new SampleEventInfo(event.note);
         sampleEvent.note = event.note;
         sampleEvent.time = nextTime+event.time/1000;
         sampleEvent.loop = false;

         pattern.plugin.feed(sampleEvent);
       });
     }

   }*/

  stop(): void {
    this.isRunning = false;
    this.loop = false;
    this.debug("stop");
    //this.ticker.post({command: "stop"});
    this.subscriptions.forEach(sub => sub.unsubscribe());


  }

  private debug(msg): void {
    console.debug(msg);
  }

  /*isRunning(): boolean {
    return this.run;
  }*/
}


