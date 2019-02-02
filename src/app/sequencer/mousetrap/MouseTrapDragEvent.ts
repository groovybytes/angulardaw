import {MouseTrapEvent} from "./MouseTrapEvent";
import {ElementRef} from "@angular/core";

export class MouseTrapDragEvent extends MouseTrapEvent{

  draggedElement:HTMLElement;
  positionX:number;
  positionY:number;
  movementX:number;
  movementY:number;
  container:ElementRef;
}
