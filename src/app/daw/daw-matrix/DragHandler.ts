import * as $ from "jquery";
import {Cell} from "../model/daw/matrix/Cell";
import {DragHandler} from "../model/daw/visual/DragHandler";
import {DawMatrixService} from "./daw-matrix.service";
import {Project} from "../model/daw/Project";


export class MatrixDragHandler implements DragHandler {
  draggedElement: JQuery<EventTarget>;
  lastDropTarget: JQuery<EventTarget>;

  constructor(private project:Project,private matrixService:DawMatrixService) {

  }

  onDrag(event: DragEvent): void {

  }

  onDragStart(event: DragEvent, cell: Cell<any>): void {

    event.dataTransfer.setData("text", JSON.stringify({command:"cell",id:cell.id}));
    this.draggedElement = $(event.target);
    this.draggedElement.addClass("drag-active");
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    $(event.target).addClass("drag-target");
    this.lastDropTarget = $(event.target);
  }

  onDragLeave(event: DragEvent): void {
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

  onDrop(event: DragEvent): void {
    this.matrixService.onDrop(event, this.project, this.project.matrix);
  }

}
