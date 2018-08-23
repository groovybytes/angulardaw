import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {TransportService} from "./transport.service";
import {Pattern} from "../../model/daw/Pattern";
import {NoteTrigger} from "../../model/daw/NoteTrigger";
import * as _ from "lodash";

@Injectable()
export class TracksService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext,
    private transportService: TransportService
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


  resetEventsWithPattern(track:Track,patternId:string):void{
    let pattern = track.patterns.find(p=>p.id===patternId);
    this.transportService.params.loopEnd.next(pattern.length);
    this.transportService.params.loop.next(true);
    track.resetEvents(pattern.events);

  }


  addPattern(track:Track): Pattern {

    let pattern = new Pattern(track.plugin.getNotes().reverse());
    pattern.id = this.guid();

    track.patterns.push(pattern);
   /* let row = entry.top / cellHeight;
    let column = entry.left / cellWidth;
    entry.data = new GridCellViewModel(null, row, column, pattern.id);*/

    return pattern;
  }

  addTrack(project: Project): Track {
    let track = new Track(this.guid(),this.audioContext, this.transportService.getEvents(), this.transportService.getInfo());
    track.name="track name";
    project.tracks.push(track);
    return track;
  }

  toggleSolo(project:Project,track:Track):void{
    track.controlParameters.solo.next(!track.controlParameters.solo.getValue());
    let isSolo = track.controlParameters.solo.getValue();
    if (isSolo) track.controlParameters.mute.next(false);
    project.tracks.forEach(_track=>{
      if (_track.id !== track.id) {
        if ( _track.controlParameters.solo.getValue()===true)  _track.controlParameters.solo.next(false);
        _track.controlParameters.mute.next(isSolo);
      }
    });
  }

  insertNote(pattern: Pattern, note: NoteTrigger): void {
    note.id=this.guid();
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index, 0, note);
  }

  removeNote(pattern: Pattern,id:string): void {
    let index = pattern.events.findIndex(ev=>ev.id===id);
    pattern.events.splice(index, 1);
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
