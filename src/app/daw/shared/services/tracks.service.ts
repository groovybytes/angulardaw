import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {Pattern} from "../../model/daw/Pattern";
import {NoteTrigger} from "../../model/daw/NoteTrigger";
import * as _ from "lodash";

@Injectable()
export class TracksService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext
  ) {

  }

  /* create(projectViewModel:Project):Promise<Pattern>{
     return new Promise((resolve,reject)=>{
       let pattern = new Pattern();
       this.patternApi.post(pattern).subscribe(pattern=>{
         projectViewModel.patterns.push(pattern);
         resolve(pattern);
       },error=>reject(error));
     })



   }*/


 /* resetEventsWithPattern(track: Track, pattern: Pattern): void {

    track.transportParams.loopEnd.next(pattern.length);
    track.transportParams.loop.next(true);
    track.resetEvents(pattern.events);

  }*/


 /* addPattern(track: Track): Pattern {

    let pattern = new Pattern(track.plugin.getNotes().reverse());
    pattern.id = this.guid();

   // track.patterns.push(pattern);
    return pattern;
  }*/

  createDefaultTrack(index:number): Track {
    return new Track(this.guid(), index,this.audioContext);
  }

  addTrack(project: Project,index:number): Track {
    let track = this.createDefaultTrack(index);
    track.name = "track name";
    track.color=project.colors[0];
    project.tracks.push(track);
    return track;
  }

  toggleSolo(project: Project, track: Track): void {
    track.controlParameters.solo.next(!track.controlParameters.solo.getValue());
    let isSolo = track.controlParameters.solo.getValue();
    if (isSolo) track.controlParameters.mute.next(false);
    project.tracks.forEach(_track => {
      if (_track.id !== track.id) {
        if (_track.controlParameters.solo.getValue() === true) _track.controlParameters.solo.next(false);
        _track.controlParameters.mute.next(isSolo);
      }
    });
  }


  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
