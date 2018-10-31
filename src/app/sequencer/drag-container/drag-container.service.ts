import {ElementRef, Injectable} from "@angular/core";
import {NoteCell} from "../model/NoteCell";
import {EventTableComponent} from "../event-table/event-table.component";
import {SequencerService} from "../sequencer.service";
import {SequencerD3Specs} from "../model/sequencer.d3.specs";
import {Pattern} from "../../shared/model/daw/Pattern";

@Injectable()
export class DragContainerService {

  private btnWasUp: boolean = false;
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private disable: boolean = false;
  private moveAbsolute: boolean = false;
  private target: NoteCell;
  private source: NoteCell;
  private readonly resizeHandlerClass: string = "event-cell-resize-handle";


  constructor(private sequencerService: SequencerService) {

    sequencerService.resizeStart.subscribe(() => {
      this.disable = true;
    });

    sequencerService.resizeEnd.subscribe(() => {
      this.disable = false;
    })
  }

  onMouseMove(event: MouseEvent, cell: NoteCell, container: ElementRef, pattern: Pattern, specs: SequencerD3Specs) {
    if (!this.disable) {
      if (this.isDragging && (this.moveAbsolute || pattern.quantizationEnabled.getValue() === false)) {
        let offsetLeft = this.getOffsetLeft(container.nativeElement);
        let x = event.x - offsetLeft - this.source.width / 2;
        this.sequencerService.setCellXPosition(this.source, x, specs, pattern);
      }
      else if (this.isResizing) {
        console.log(event.movementX);
        this.source.width += -event.movementX;
        this.source.x+= event.movementX;

      }
    }

  }

  onClick(cell: NoteCell): void {

  }

  onDblClick(cell: NoteCell, eventTable: EventTableComponent): void {
    if (cell.data) this.sequencerService.removeEvent(eventTable.eventCells, cell, eventTable.pattern);
    else this.sequencerService.addNote(cell.row, cell.column, eventTable.eventCells, eventTable.specs, eventTable.pattern);
  }

  onMouseDown(cell: NoteCell, event: MouseEvent): boolean {
    this.btnWasUp = false;
    if (cell.data) {
      setTimeout(() => {
        if (this.isResizeHandle(event.target)) {
          this.isResizing = true;
        }
        else {
          this.isDragging = (this.btnWasUp === false);
          this.moveAbsolute = event.ctrlKey;
        }

        this.source = cell;

      }, 100);
    }

    event.stopPropagation();

    return false; //return false to avoid browser dragging
  }

  onMouseUp(cell: NoteCell): void {
    if (this.isDragging && this.target) {
      this.sequencerService.moveCell(this.source, this.target);

    }
    this.btnWasUp = true;
    this.isDragging = false;
    this.moveAbsolute = false;
    this.isResizing = false;
  }

  onMouseOver(cell: NoteCell, specs: SequencerD3Specs, pattern: Pattern): void {
    if (!this.disable) {
      if (cell && this.isDragging) {
        if (this.moveAbsolute || pattern.quantizationEnabled.getValue() === false) {
          if (cell.row !== this.source.row) {
            this.sequencerService.setCellYPosition(this.source, cell.row, specs, pattern);
          }
        }
        else {
          cell.isDragTarget = this.isDragging;
          this.target = cell;
        }

      }
    }
  }

  onMouseLeave(cell: NoteCell): void {
    if (!this.disable) {
      if (cell) {
        cell.isDragTarget = false;
        this.target = null;
      }
    }
  }

  getEventCell(event: MouseEvent, eventTable: EventTableComponent): NoteCell {
    let htmlElement = (<HTMLElement>event.target);
    if (this.isResizeHandle(event.target)) {
      htmlElement = htmlElement.parentElement;
    }

    let isCell = htmlElement.classList.contains("note-cell");
    let isEventCell = htmlElement.classList.contains("event-cell");

    let cell: NoteCell;
    if (isCell || isEventCell) {
      let id = $(htmlElement).attr("data-id");
      if (isEventCell) cell = eventTable.eventCells.find(cell => cell.id === id);
      else cell = eventTable.tableCells.find(cell => cell.id === id);
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
