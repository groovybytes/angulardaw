import {ElementRef, Injectable} from "@angular/core";
import {NoteCell} from "./model/NoteCell";
import {SequencerService} from "./sequencer.service";
import {Pattern} from "../shared/model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import * as $ from "jquery";
import {EventTableModel} from "./event-table/event-table.model";
import {element} from "protractor";
import {MouseTrapDragEvent} from "./mousetrap/MouseTrapDragEvent";
import {MouseTrapEvent} from "./mousetrap/MouseTrapEvent";

@Injectable()
export class SequencerInteractionService {

  private readonly resizeHandlerClass: string = "event-cell-resize-handle";
  private readonly minWidth: number = 50;

  constructor(private sequencerService: SequencerService) {


  }

  onClick(event: MouseTrapEvent, model: EventTableModel): void {
    let cell = this.getCellFromElement(event.element, model.eventCells, model.tableCells);
    model.selectedEvent = cell ? cell.data : null;
  }

  onDblClick(event: MouseTrapEvent, pattern: Pattern, model: EventTableModel): void {
    let cell = this.getCellFromElement(event.element, model.eventCells, model.tableCells);
    if (cell.data) this.sequencerService.removeEvent(model.eventCells, cell, pattern);
    else this.sequencerService.addNote(cell.row, cell.column, model.eventCells, model.specs, pattern);
  }

  onDrag(event: MouseTrapDragEvent, model: EventTableModel, pattern: Pattern): void {
    let cell = this.getCellFromElement(event.draggedElement, model.eventCells, model.tableCells);

    if (this.isResizeHandle(event.draggedElement)) {
      let leftBorder = model.specs.cellWidth;
      let rightBorder = model.specs.cellWidth * (model.specs.columns + 1);

      let isRight = $(event.draggedElement).hasClass("right-handle");
      let elementLeft = $(event.draggedElement.parentElement).offset().left;
      let mouseLeft = event.event.pageX;
      let dif = mouseLeft - elementLeft;

      if (isRight) {
        let newWidth=dif;
        if (newWidth<this.minWidth) newWidth=this.minWidth;
        else if (cell.x+newWidth>rightBorder) newWidth=rightBorder-cell.x;

        cell.width=newWidth;
      }
      else {
        let newCellX:number;
        let newX1=cell.x + dif;
        let currentX2=cell.x+cell.width;

        if (newX1 >= leftBorder) {
          if (currentX2-newX1>=this.minWidth) newCellX = newX1;
          else newCellX=currentX2-this.minWidth;
        }
        else newCellX=leftBorder;

        let newWidth = currentX2-newCellX;
        if (newWidth >= this.minWidth) {
          cell.width = newWidth;
        }
        else cell.width=this.minWidth;


        this.sequencerService.setCellXPosition(cell,newCellX,model.specs,pattern);
      }

    }
    else {
      let offsetLeft = this.getOffsetLeft(event.container.nativeElement);
      let newCellX = event.positionX - offsetLeft - cell.width / 2;
      this.sequencerService.setCellXPosition(cell, newCellX, model.specs, pattern);
    }

  }

  /* onResize(): void {
     console.log("resize");
   }*/

  private getCellFromElement(htmlElement: Element, eventCells: Array<NoteCell>, tableCells: Array<NoteCell>): NoteCell {
    if (this.isResizeHandle(htmlElement)) {
      htmlElement = htmlElement.parentElement;
    }

    let isCell = htmlElement.classList.contains("note-cell");
    let isEventCell = htmlElement.classList.contains("event-cell");

    let cell: NoteCell;
    if (isCell || isEventCell) {
      let id = $(htmlElement).attr("data-id");
      if (isEventCell) cell = eventCells.find(cell => cell.id === id);
      else cell = tableCells.find(cell => cell.id === id);
    }

    return cell;
  }

  private isResizeHandle(element): boolean {
    return $(element).hasClass(this.resizeHandlerClass);
  }

  private getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
      if (!isNaN(elem.offsetLeft)) {
        offsetLeft += elem.offsetLeft;
      }
    } while (elem = elem.offsetParent);
    return offsetLeft;
  }

}
