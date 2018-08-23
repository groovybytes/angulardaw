import {BehaviorSubject} from "rxjs/index";

export class TrackControlParameters{
  gain:BehaviorSubject<number> = new BehaviorSubject(100);
  solo:BehaviorSubject<boolean> = new BehaviorSubject(false);
  mute:BehaviorSubject<boolean> = new BehaviorSubject(false);
}
