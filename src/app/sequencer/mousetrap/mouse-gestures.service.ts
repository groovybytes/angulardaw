import {ElementRef, EventEmitter, Inject, Injectable} from "@angular/core";
import {MouseTrapEvents} from "./MouseTrapEvents";
import {MouseTrapEvent} from "./MouseTrapEvent";
import {MouseTrapDragEvent} from "./MouseTrapDragEvent";


@Injectable()
export class MouseGesturesService {

  private btnWasUp: boolean = false;
  private isDragging: boolean = false;
  private readonly doubleClickThreshold: number = 300;
  private btnDownCount: number = 0;
  private btnUpCount: number = 0;
  private mouseDownTimeout;
  private dragSource: EventTarget;

  constructor(@Inject("MouseEvents") private mouseEvents: MouseTrapEvents) {


  }

  mouseDown(event: MouseEvent): boolean {
    this.btnWasUp = false;
    this.btnDownCount += 1;

    this.mouseDownTimeout = setTimeout(() => {
      if (this.btnWasUp === false) {
        this.isDragging = true;
        this.dragSource = event.target;
        this.mouseDownTimeout=null;
      }

    }, this.doubleClickThreshold * 1.5);

    event.stopPropagation();


    return false; //return false to avoid browser dragging
  }

  mouseUp(event: MouseEvent): void {

    if (this.isDragging===false){
      if (this.mouseDownTimeout) {
        clearTimeout(this.mouseDownTimeout);
        this.mouseDownTimeout = null;
      }
      this.btnUpCount += 1;
      this.btnWasUp = true;

      setTimeout(() => {

        if (this.btnUpCount === 1) {
          this.mouseEvents.click.emit(new MouseTrapEvent(event));
        }
        else if (this.btnUpCount === 2) {
          this.mouseEvents.dblClick.emit(new MouseTrapEvent(event));
        }
        this.clear();
      }, this.doubleClickThreshold);
    }
    else {
      this.mouseEvents.dragEnd.emit();
      this.clear();
    }
  }

  mouseMove(event: MouseEvent, container: ElementRef) {

    if (this.isDragging) {

      let trapEvent = new MouseTrapDragEvent(event);
      trapEvent.draggedElement = <HTMLElement>this.dragSource;
      trapEvent.container = container;
      trapEvent.positionX = event.x;
      trapEvent.positionY = event.y;
      trapEvent.movementX = event.movementX;
      trapEvent.movementY = event.movementY;

      this.mouseEvents.drag.emit(trapEvent);
    }
    else if (this.btnDownCount === 1 && this.btnWasUp === false) {
      if (this.mouseDownTimeout) {
        clearTimeout(this.mouseDownTimeout);
        this.mouseDownTimeout = null;
      }
      this.isDragging = true;
      this.dragSource = event.target;
    }
  }

  private clear(): void {
    this.btnUpCount = 0;
    this.btnDownCount = 0;
    this.isDragging = false;
  }
}
