import {EventEmitter, Injectable} from '@angular/core';
import {Project} from "../../model/daw/Project";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {MusicMath} from "../../model/utils/MusicMath";
import {NoteLength} from "../../model/mip/NoteLength";
import {Subscription} from "rxjs";
import {AudioContextService} from "./audiocontext.service";
import {PlayerSession} from "../../model/daw/session/PlayerSession";
import {Thread} from "../../model/daw/Thread";


@Injectable({
  providedIn: 'root'
})
export class SchedulerService {


  constructor(private audioContext: AudioContextService) {
  }


  run(session:PlayerSession,events: Array<NoteEvent>,ticker:Thread): void {

    let subscriptions: Array<Subscription> = [];
    let position = 0;
    let lookAhead = 2;
    let startTime;

    ticker.post(
      {
        command: "set-interval"
        , params: MusicMath.getTickTime(session.bpm.getValue(), NoteLength.Quarter)
      });
    subscriptions.push(ticker.error.subscribe(error => console.error(error)));
    subscriptions.push(ticker.message.subscribe(msg => {
      if (msg.data.hint === "tick") {

        if (position < events.length) {
          if (!startTime) startTime = this.audioContext.getTime();
          let nextEvents: Array<NoteEvent> = [];
          let frameStart = this.audioContext.getTime();
          let frameEnd = frameStart + lookAhead;
          let inFrame = (time) => time >= frameStart && time <= frameEnd;

          let bpmFactor = 120/session.bpm.getValue();
          while (position < events.length && inFrame(startTime + events[position].time*bpmFactor)) {
            nextEvents.push(events[position]);
            position++;
          }
          nextEvents.forEach(event => {
            let triggerTime = event.time*bpmFactor - (this.audioContext.getTime() - startTime);
            session.play.emit(new NoteEvent(event.note,null,triggerTime,event.length*bpmFactor));
            //session.play.emit({note: event.note, time: triggerTime, length: event.length*bpmFactor});
          })
        }

      }
    }));


    let stopSubscription = session.stop.subscribe(()=>{
      stopSubscription.unsubscribe();
      ticker.post({command: "stop"})
    });

    ticker.post({command: "start"});



  }

}
