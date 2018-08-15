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
    note.id=this.guid();
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index, 0, note);
  }

  removeNote(pattern: PatternViewModel,id:string): void {
    let index = pattern.events.findIndex(ev=>ev.id===id);
    pattern.events.splice(index, 1);
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
