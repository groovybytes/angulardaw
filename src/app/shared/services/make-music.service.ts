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
      let sampleEvent = new SampleEventInfo();
      sampleEvent.note = event.note;
      sampleEvent.loopLength = loopLength;
      sampleEvent.offset = 0;
      //sampleEvent.getOffset = () => startTime + sampleEvent.loopLength * sampleEvent.loopsDone;
      let sample = pluginTarget.getSample(event.note);
      if (sample.baseNote) sampleEvent.detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(event.note)) * 100;
      //sample.trigger(sampleEvent, startPromise);
    }

  }

  startPlay(note:string):void{

    let pluginTarget= this.daw.project.getValue().activePlugin.getValue();
    if (pluginTarget){
      let sampleEvent = new SampleEventInfo();
      sampleEvent.note = note;
      sampleEvent.loopLength = 0;
      sampleEvent.duration=1000;
      sampleEvent.offset=0;
      let sample = pluginTarget.getSample(note);
      if (sample) {
        if (sample.baseNote) sampleEvent.detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(note)) * 100;
        //sample.trigger(sampleEvent);
      }
      else console.warn("no sample found for "+note);

    }
  }


  stopPlay(note:string):void{

    let pluginTarget=this.daw.project.getValue().activePlugin.getValue();
    if (pluginTarget){
      let sample = pluginTarget.getSample(note);
      if (sample) {
        //sample.stop();
      }
      else console.warn("no sample found for "+note);

    }
  }
}
