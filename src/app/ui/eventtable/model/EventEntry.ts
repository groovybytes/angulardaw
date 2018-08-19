import {BehaviorSubject} from "rxjs";
import {EventEmitter} from "@angular/core";

export class EventEntry<T>{

  clicked: EventEmitter<void> = new EventEmitter();
  dblClicked: EventEmitter<void> = new EventEmitter();

  constructor(column: number, row: number, active: boolean, data: T) {
    this.column = new BehaviorSubject(column);
    this.row = new BehaviorSubject(row);
    this.active = new BehaviorSubject(active);
    this.data = new BehaviorSubject(data);
  }
  column:BehaviorSubject<number>;
  row:BehaviorSubject<number>;
  active:BehaviorSubject<boolean>;
  data:BehaviorSubject<T>;
  x:number;
  y:number;


}
