import * as $ from "jquery";
import {ElementRef} from "@angular/core";
import {MatrixCell} from "../model/daw/MatrixCell";

export class DragHandler {
  draggedCell: MatrixCell;
  draggedElement: JQuery<EventTarget>;
  lastDropTarget: JQuery<EventTarget>;

  constructor() {

  }

  onDrag(event: DragEvent, cell: MatrixCell): void {

  }

  onDragStart(event: DragEvent, cell: MatrixCell): void {
    this.draggedCell = cell;
    this.draggedElement = $(event.target);
    this.draggedElement.addClass("drag-active");
  }

  onDragOver(event: DragEvent, cell: MatrixCell): void {
    event.preventDefault();
    $(event.target).addClass("drag-target");
    this.lastDropTarget = $(event.target);
  }

  onDragLeave(event: DragEvent, cell: MatrixCell): void {
    $(event.target).removeClass("drag-target");
  }

  onDragEnd(event: DragEvent): void {
    this.draggedElement.removeClass("drag-active");
    this.draggedElement = null;
    if (this.lastDropTarget) {
      this.lastDropTarget.removeClass("drag-target");
      this.lastDropTarget = null;
    }
  }

  onDrop(event: DragEvent, cell: MatrixCell): void {

  }
}
