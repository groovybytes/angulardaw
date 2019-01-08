import {BehaviorSubject} from "rxjs";
import {Project} from "./daw/Project";
import {EventEmitter} from "@angular/core";

export class DawInfo{

  destroy:EventEmitter<void>=new EventEmitter();
  project:BehaviorSubject<Project>=new BehaviorSubject(null);
  ready:BehaviorSubject<boolean>=new BehaviorSubject(false);
}
