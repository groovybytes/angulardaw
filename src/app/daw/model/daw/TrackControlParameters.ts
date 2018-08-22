import {BehaviorSubject} from "rxjs/index";

export class TrackControlParameters{
  gain:BehaviorSubject<number> = new BehaviorSubject(100);
}
