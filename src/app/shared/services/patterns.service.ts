import {Inject, Injectable} from "@angular/core";
import {Pattern} from "../../model/daw/Pattern";
import * as _ from "lodash";
import {NoteTriggerDto} from "../api/NoteTriggerDto";
import {Project} from "../../model/daw/Project";
import {ApiEndpoint} from "../api/ApiEndpoint";

@Injectable()
export class PatternsService {

  constructor(@Inject("PatternApi") private patternApi: ApiEndpoint<Pattern>) {

  }

 /* create(project:Project):Promise<Pattern>{
    return new Promise((resolve,reject)=>{
      let pattern = new Pattern();
      this.patternApi.post(pattern).subscribe(pattern=>{
        project.patterns.push(pattern);
        resolve(pattern);
      },error=>reject(error));
    })



  }*/

  insertNote(pattern:Pattern,note: NoteTriggerDto): void {
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index,0,note);
  }

  removeNote(pattern:Pattern,note: NoteTriggerDto): void {
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index,0,note);
  }



}
