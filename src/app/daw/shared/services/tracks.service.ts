import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {TransportService} from "./transport.service";
import {Pattern} from "../../model/daw/Pattern";

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


  addPattern(track:Track): Pattern {

    let pattern = new Pattern();
    pattern.id = this.guid();

    track.patterns.push(pattern);
   /* let row = entry.top / cellHeight;
    let column = entry.left / cellWidth;
    entry.data = new GridCellViewModel(null, row, column, pattern.id);*/

    return pattern;
  }

  addTrack(project: Project): Track {
    let track = new Track(this.guid(),this.audioContext, this.transportService.getEvents(), this.transportService.getInfo());
    project.tracks.push(track);
    return track;
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
