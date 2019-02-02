import {Inject, Injectable} from '@angular/core';
import {DawInfo} from "../../model/DawInfo";
import {Project} from "../../model/daw/Project";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppHistoryService {

  private project:Project;
  private projectSubscriptions:Array<Subscription>;

  constructor(@Inject("daw") private daw:DawInfo) {
    daw.project.subscribe(project=>{
      this.project=project;

    })
  }
}
