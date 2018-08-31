import * as $ from "jquery";
import {Cell} from "../model/daw/matrix/Cell";
import {NoteCell} from "./model/NoteCell";
import {DragHandler} from "../model/daw/visual/DragHandler";
import {SequencerService2} from "./sequencer2.service";


export class SequencerDragHandler implements DragHandler {
  draggedElement: JQuery<EventTarget>;
  lastDropTarget: JQuery<EventTarget>;
  private draggedCell: NoteCell;


  constructor(
    private cells: Array<NoteCell>,
    private quantizationEnabled: () => boolean,
    private sequencerService: SequencerService2) {

  }

  onDrag(event: DragEvent): void {


  }

  onDragStart(event: DragEvent, cell: Cell<any>): void {
    event.dataTransfer.setData("text", JSON.stringify({command: "cell", id: cell.id}));
    this.draggedElement = $(event.target);
    this.draggedCell = this.cells.find(cell => cell.id === $(event.target).attr("data-id"));
    if (this.quantizationEnabled()) this.draggedElement.addClass("drag-active");
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.quantizationEnabled()) {
      $(event.target).addClass("drag-target");
      this.lastDropTarget = $(event.target);
    }

  }

  onDragLeave(event: DragEvent): void {
    $(event.target).removeClass("drag-target");
  }

  onDragEnd(event: DragEvent): void {
    if (this.quantizationEnabled()) {
      this.draggedElement.removeClass("drag-active");
      this.draggedElement = null;
      if (this.lastDropTarget) {
        this.lastDropTarget.removeClass("drag-target");
        this.lastDropTarget = null;
      }
    }
  }

  onDrop(event: DragEvent): void {
    if (this.quantizationEnabled()){
      $(event.target).removeClass("drag-target");
      let targetCell = this.cells.find(cell => cell.id === $(event.target).attr("data-id"));
      this.sequencerService.moveCell(this.draggedCell, targetCell);
    }
  }


}
