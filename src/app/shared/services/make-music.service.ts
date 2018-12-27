import {EventEmitter, Inject, Injectable} from '@angular/core';
import {AudioContextService} from "./audiocontext.service";
import {SampleEventInfo} from "../../model/daw/SampleEventInfo";
import {DawInfo} from "../../model/DawInfo";
import {Subscription} from "rxjs";
import {AudioPlugin} from "../../model/daw/plugins/AudioPlugin";
import {Notes} from "../../model/mip/Notes";
import {NoteEvent} from "../../model/mip/NoteEvent";

@Injectable({
  providedIn: 'root'
})
export class MakeMusicService {

  private subscriptions:Array<Subscription>=[];
  private playingPlugin:AudioPlugin;

  constructor(
    private audioContextService: AudioContextService,
    @Inject("daw") private daw: DawInfo,
    @Inject("Notes") private notes:Notes
  ) {

    /*this.subscriptions.push(daw.destroy.subscribe(()=>this.destroy()));
    this.subscriptions.push(daw.project.getValue().activePlugin.subscribe(()=>{

    }));
*/
  }


  private destroy():void{
    this.subscriptions.forEach(subscription=>subscription.unsubscribe());
  }

  trigger(event:NoteEvent,startTime:number,startPromise?:Promise<void>,loopLength?:number):void {
    let pluginTarget = this.daw.project.getValue().activePlugin.getValue();
    if (pluginTarget) {
      let sampleEvent = new SampleEventInfo(event.note);
      sampleEvent.note = event.note;
      sampleEvent.time = event.time / 1000;
      sampleEvent.loopLength = loopLength;
      sampleEvent.getOffset = () => startTime + sampleEvent.loopLength * sampleEvent.loopsPlayed;
      let sample = pluginTarget.getSample(event.note);
      if (sample.baseNote) sampleEvent.detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(event.note)) * 100;
      sample.trigger(sampleEvent, startPromise);
    }

  }

  startPlay(note:string):EventEmitter<void>{

    let pluginTarget= this.daw.project.getValue().activePlugin.getValue();
    if (pluginTarget){
      let sampleEvent = new SampleEventInfo(note);
      sampleEvent.note = note;
      sampleEvent.time = this.audioContextService.getTime();
      sampleEvent.loopLength = 0;
      sampleEvent.duration=1000;
      sampleEvent.offset=0;
      let sample = pluginTarget.getSample(note);
      if (sample) {
        if (sample.baseNote) sampleEvent.detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(note)) * 100;
        sample.trigger(sampleEvent);
        let stopEvent = new EventEmitter<void>();
        let subscription = stopEvent.subscribe(()=>{
          subscription.unsubscribe();
          sample.stop();
        });
        return stopEvent;
      }
      else console.warn("no sample found for "+note);

    }
  }


  stopPlay(note:string):void{

    let pluginTarget=this.daw.project.getValue().activePlugin.getValue();
    if (pluginTarget){
      let sample = pluginTarget.getSample(note);
      if (sample) {
        sample.stop();
      }
      else console.warn("no sample found for "+note);

    }
  }
}
