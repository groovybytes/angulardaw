import {Inject, Injectable} from '@angular/core';
import {DawInfo} from "../../model/DawInfo";
import {Subscription} from "rxjs";
import {Thread} from "../../model/daw/Thread";
import {Pattern} from "../../model/daw/Pattern";
import {SampleEventInfo} from "../../model/daw/SampleEventInfo";
import {MusicMath} from "../../model/utils/MusicMath";
import {AudioContextService} from "./audiocontext.service";
import {Sample} from "../../model/daw/Sample";
import {Notes} from "../../model/mip/Notes";
import {TimeSignature} from "../../model/mip/TimeSignature";

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
  private samples: Array<Sample> = [];

  constructor(
    @Inject("daw") private daw: DawInfo,
    @Inject("Notes") private notes: Notes,
    private audioContextService: AudioContextService) {
    this.audioContext = audioContextService.getAudioContext();
  }


  start(): void {
    /*if (this.isRunning) {
      this.stop();
    } else {
      this.isRunning = true;
      this.loop = true;
      this.debug("start");
      let project = this.daw.project.getValue();
      this.ticker = project.threads.find(t => t.id === "ticker");
      this.ticker.post(
        {
          command: "set-interval"
          , params: MusicMath.getTickTime(project.transport.settings.global.bpm, project.settings.quantizationBase)
        });
      this.subscriptions.push(this.ticker.error.subscribe(error => console.error(error)));


      /!*this.subscriptions.push(this.ticker.message.subscribe(msg => {
        this.patterns.forEach(pattern => {
          if (msg.data.hint === "tick") {

            if (pattern.id !== "_metronome") {
              let loopTicks = MusicMath.getBeatTicks(pattern.quantization.getValue()) * pattern.length;
              //MusicMath.getBeatNumber()
              //console.log(MusicMath.getBarNumber(msg.data.value, project.settings.quantizationBase, project.transport.settings.global.beatUnit));
              let tick = MusicMath.getTick(msg.data.value, project.settings.quantizationBase, pattern.quantization.getValue(), loopTicks);

              //let loopTick = (tick % loopTicks);
              //if (loopTick === 0) pattern.loopsPlayed++;
              //console.log(pattern.loopsPlayed);
              //pattern.tick.next(tick);
            }

          } else if (msg.data.hint === "start") {
            pattern.beat = -1;
          } else if (msg.data.hint === "stop") {
            pattern.beat = -1;
          }
        })
      }));*!/


      let loopBars = 0;


      let patterns: Array<Pattern> = this.patterns = [];
      this.debug("channels: " + project.transport.channels);
      project.transport.channels.forEach(channel => {
        let pattern = project.patterns.find(pattern => pattern.id === channel);
        if (pattern) {
          patterns.push(pattern);
          /!*this.subscriptions.push(this.ticker.message
            .pipe(filter(event =>  {

            }))
            .subscribe(event => ));*!/
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

      let startTime: number;

      let start = false;
      let startPromise = new Promise<void>((resolve) => {
        let interval=setInterval(() => {
          if (start) {
            clearInterval(interval);
            setTimeout(()=>{
              resolve();
            })

          }

        })
      });

      patterns.forEach(pattern => {

        if (pattern.id !== "_metronome") {
          this.subscriptions.push(pattern.noteInserted.subscribe((event) => {

            let sampleEvent = new SampleEventInfo();
            sampleEvent.note = event.note;
            sampleEvent.loopLength = pattern.getLength() / 1000;
            sampleEvent.offset = event.time / 1000;
            sampleEvent.duration = event.length ? event.length / 1000 : MusicMath.getBeatTime(project.transport.settings.global.bpm)/1000;
            sampleEvent.loop = true;
            let sample = pattern.plugin.getSample(event.note);
            if (sample.baseNote) sampleEvent.detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(event.note)) * 100;

            let patternLength=pattern.getLength()/1000;
            let currentTime = this.audioContextService.getTime();
            let currentLoopOffset = (currentTime - startTime) % patternLength;
            let newStartTime=currentTime+patternLength-currentLoopOffset;

            sampleEvent.getLoopStartTime = () => newStartTime;
            sample.trigger(sampleEvent, startPromise);
          }));
          this.subscriptions.push(pattern.noteRemoved.subscribe((event) => {
            console.log("note noteRemoved");
          }));
          this.subscriptions.push(pattern.noteUpdated.subscribe((event) => {
            console.log("note noteUpdated");
          }));
        }


        pattern.events.forEach(event => {
          let sampleEvent = new SampleEventInfo();
          sampleEvent.note = event.note;
          sampleEvent.loopLength = pattern.getLength() / 1000;
          sampleEvent.offset = event.time / 1000;
          sampleEvent.duration = event.length ? event.length / 1000 : MusicMath.getBeatTime(project.transport.settings.global.bpm)/1000;
          sampleEvent.loop = true;
          let sample = pattern.plugin.getSample(event.note);
          if (sample.baseNote) sampleEvent.detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(event.note)) * 100;
          sampleEvent.getLoopStartTime = () => startTime;
          sample.trigger(sampleEvent, startPromise);
          this.samples.push(sample);
        });
      });

      startTime = this.audioContext.currentTime;
      start = true;
      this.ticker.post({command: "start"});

    }*/

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
    this.ticker.post({command: "stop"});
    this.daw.project.getValue().transport.channels.length = 0;
    this.subscriptions.forEach(sub => sub.unsubscribe());
    //this.samples.forEach(sample => sample.stop());


  }

  private debug(msg): void {
    console.debug(msg);
  }

  /*isRunning(): boolean {
    return this.run;
  }*/
}

