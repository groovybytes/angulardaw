import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";

export interface WindowContent{

  active: BehaviorSubject<boolean>;
  id(): string;
  title(): string;

}
