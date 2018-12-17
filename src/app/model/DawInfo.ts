import {BehaviorSubject} from "rxjs";
import {Project} from "./daw/Project";

export class DawInfo{

  project:BehaviorSubject<Project>=new BehaviorSubject(null);
}
