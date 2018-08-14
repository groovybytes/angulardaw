import {Inject, Injectable} from "@angular/core";
import {PatternViewModel} from "../../model/viewmodel/PatternViewModel";
import * as _ from "lodash";
import {NoteTriggerViewModel} from "../../model/viewmodel/NoteTriggerViewModel";
import {ApiEndpoint} from "../api/ApiEndpoint";

@Injectable()
export class PatternsService {

  constructor(@Inject("PatternApi") private patternApi: ApiEndpoint<PatternViewModel>) {

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

  insertNote(pattern: PatternViewModel, note: NoteTriggerViewModel): void {
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index, 0, note);
  }

  removeNote(pattern: PatternViewModel, note: NoteTriggerViewModel): void {
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index, 1);
  }


}
