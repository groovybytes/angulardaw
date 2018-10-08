import {BehaviorSubject} from "rxjs";
import * as Mousetrap from "mousetrap";

export class KeyboardState{
  Ctrl:BehaviorSubject<boolean>=new BehaviorSubject(false);

  bind(key:string,subject:BehaviorSubject<boolean>):void{
    Mousetrap.bind(key, () => {
      subject.next(true);
    });
    Mousetrap.bind(key, () => {
      subject.next(false);
    },'keyup');
  }
}
