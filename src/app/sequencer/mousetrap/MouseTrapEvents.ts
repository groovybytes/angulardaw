import {EventEmitter} from "@angular/core";
import {MouseTrapEvent} from "./MouseTrapEvent";
import {MouseTrapDragEvent} from "./MouseTrapDragEvent";

export class MouseTrapEvents {
  click: EventEmitter<MouseTrapEvent> = new EventEmitter();
  dblClick: EventEmitter<MouseTrapEvent> = new EventEmitter();
  drag: EventEmitter<MouseTrapDragEvent> = new EventEmitter();
  dragEnd: EventEmitter<void> = new EventEmitter();
  mouseOver: EventEmitter<MouseTrapEvent> = new EventEmitter();
  mouseOut: EventEmitter<MouseTrapEvent> = new EventEmitter();

}
