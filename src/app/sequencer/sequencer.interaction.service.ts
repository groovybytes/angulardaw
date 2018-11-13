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
  private draggedCell: NoteCell;
  private isResizing: boolean = false;
  private mouseOverCell: NoteCell;

  constructor(private sequencerService: SequencerService) {


  }

  onClick(event: MouseTrapEvent, model: EventTableModel): void {
    let cell = this.getCellFromElement(event.element, model.eventCells, model.tableCells);
    model.selectedEvent = cell ? cell.data : null;
  }

  onDblClick(event: MouseTrapEvent, pattern: Pattern, model: EventTableModel): void {
    let cell = this.getCellFromElement(event.element, model.eventCells, model.tableCells);
    if (cell){
      if (cell.data) this.sequencerService.removeEvent(model.eventCells, cell, pattern);
      else this.sequencerService.addNote(cell.row, cell.column, model.eventCells, model.specs, pattern);
    }

  }

  onMouseOver(event: MouseTrapEvent, model: EventTableModel, pattern: Pattern): void {

    let cell = this.getCellFromElement(event.element, model.eventCells, model.tableCells);
    this.mouseOverCell = cell;
    if (cell && !this.isResizing) {
      if (this.draggedCell && cell.row !== this.draggedCell.row) {
        this.sequencerService.setCellYPosition(this.draggedCell, cell.row, model.specs, pattern);
      }
    }
  }

  onMouseOut(event: MouseTrapEvent, model: EventTableModel): void {

  }

  onDrag(event: MouseTrapDragEvent, model: EventTableModel, pattern: Pattern): void {

    this.isResizing = this.isResizeHandle(event.draggedElement);
    if (!this.draggedCell) this.draggedCell = this.getCellFromElement(event.draggedElement, model.eventCells, model.tableCells);
    if (this.isResizing) {
      if (event.event.ctrlKey || pattern.quantizationEnabled.getValue() === false) this.resizeAbsolute(event, model, this.draggedCell, pattern);
      else this.resizeGrid(event, model, this.draggedCell, pattern);
    }
    else {
      if (event.event.ctrlKey || pattern.quantizationEnabled.getValue() === false) this.moveAbsolute(event, model, this.draggedCell, pattern);
      else this.moveGrid(event, model, this.draggedCell, pattern);

    }

  }

  onDragEnd(): void {
    this.draggedCell = null;
    this.isResizing = false;
  }

  private resizeAbsolute(event: MouseTrapDragEvent, model: EventTableModel, cell: NoteCell, pattern: Pattern): void {

    let minWidth = this.minWidth;
    let leftBorder = model.specs.cellWidth;
    let rightBorder = model.specs.cellWidth * (model.specs.columns + 1);

    let isRight = $(event.draggedElement).hasClass("right-handle");
    let elementLeft = $(event.draggedElement.parentElement).offset().left;
    let mouseLeft = event.event.pageX;
    let dif = mouseLeft - elementLeft;

    if (isRight) {
      let newWidth = dif;
      if (newWidth < minWidth) newWidth = minWidth;
      else if (cell.x + newWidth > rightBorder) newWidth = rightBorder - cell.x;

      cell.width = newWidth;
      this.sequencerService.setCellNoteLength(cell,model.specs,pattern);
    }
    else {
      let newCellX: number;
      let newX1 = cell.x + dif;
      let currentX2 = cell.x + cell.width;

      if (newX1 >= leftBorder) {
        if (currentX2 - newX1 >= minWidth) newCellX = newX1;
        else newCellX = currentX2 - minWidth;
      }
      else newCellX = leftBorder;

      let newWidth = currentX2 - newCellX;
      if (newWidth >= minWidth) {
        cell.width = newWidth;
      }
      else cell.width = minWidth;


      this.sequencerService.setCellXPosition(cell, newCellX, model.specs, pattern);
      this.sequencerService.setCellNoteLength(cell,model.specs,pattern);
    }
  }

  private resizeGrid(event: MouseTrapDragEvent, model: EventTableModel, cell: NoteCell, pattern: Pattern): void {

    let leftBorder = model.specs.cellWidth;
    let rightBorder = model.specs.cellWidth * (model.specs.columns + 1);
    let containerLeft = $(event.draggedElement.parentElement.parentElement).offset().left;
    let containerPosition = event.event.pageX - containerLeft;
    let isRight = $(event.draggedElement).hasClass("right-handle");

    let nextGridPosition =
      Math.trunc(containerPosition / model.specs.cellWidth) * model.specs.cellWidth + model.specs.cellWidth * (isRight ? 1 : 0);

    if (nextGridPosition >= leftBorder && nextGridPosition <= rightBorder) {
      if (isRight) {
        if (nextGridPosition - cell.x > 0) {
          cell.width = nextGridPosition - cell.x;
          this.sequencerService.setCellNoteLength(cell,model.specs,pattern);
        }
      }
      else {
        let x2 = cell.x + cell.width;
        let newCellX = nextGridPosition;
        if (newCellX < x2) {
          cell.width = x2 - newCellX;
          this.sequencerService.setCellXPosition(cell, newCellX, model.specs, pattern);
          this.sequencerService.setCellNoteLength(cell,model.specs,pattern);
        }
      }
    }

  }

  private moveAbsolute(event: MouseTrapDragEvent, model: EventTableModel, cell: NoteCell, pattern: Pattern): void {
    let offsetLeft = this.getOffsetLeft(event.container.nativeElement);
    let newCellX = event.positionX - offsetLeft - this.draggedCell.width / 2;
    this.sequencerService.setCellXPosition(this.draggedCell, newCellX, model.specs, pattern);
  }

  private moveGrid(event: MouseTrapDragEvent, model: EventTableModel, cell: NoteCell, pattern: Pattern): void {
    if (this.mouseOverCell) {
      this.sequencerService.setCellXPosition(this.draggedCell, this.mouseOverCell.x, model.specs, pattern);
    }

  }

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
