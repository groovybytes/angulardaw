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
  private moveAbsolute: boolean = false;
  private dragTarget: NoteCell;
  private dragSource: NoteCell;


  constructor(private sequencerService: SequencerService) {

  }

  onMouseMove(event: MouseEvent, container: ElementRef, pattern: Pattern, specs: SequencerD3Specs) {
    if (this.isDragging && this.moveAbsolute) {
      let offsetLeft = this.getOffsetLeft(container.nativeElement);
      let x = event.x - offsetLeft - this.dragSource.width / 2;
      this.sequencerService.setCellXPosition(this.dragSource, x, specs, pattern);

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
    setTimeout(() => {
      this.isDragging = (this.btnWasUp === false);
      this.moveAbsolute = event.ctrlKey;
      this.dragSource = cell;

    }, 100);
    event.stopPropagation();

    return false; //return false to avoid browser dragging
  }

  onMouseUp(cell: NoteCell): void {
    if (this.isDragging && this.dragTarget) {
      this.sequencerService.moveCell(this.dragSource, this.dragTarget);

    }
    this.btnWasUp = true;
    this.isDragging = false;
    this.moveAbsolute = false;
  }

  onMouseOver(cell: NoteCell, specs: SequencerD3Specs, pattern: Pattern): void {
    if (cell && this.isDragging) {
      if (this.moveAbsolute) {
        if (cell.row !== this.dragSource.row) {
          this.sequencerService.setCellYPosition(this.dragSource, cell.row, specs, pattern);
        }
      }
      else {
        cell.isDragTarget = this.isDragging;
        this.dragTarget = cell;
      }

    }
  }

  onMouseLeave(cell: NoteCell): void {
    if (cell) {
      cell.isDragTarget = false;
      this.dragTarget = null;
    }
  }

  getEventCell(event: MouseEvent, eventTable: EventTableComponent): NoteCell {
    let isCell = (<HTMLElement>event.target).classList.contains("note-cell");
    let isEventCell = (<HTMLElement>event.target).classList.contains("event-cell");

    let cell: NoteCell;
    if (isCell || isEventCell) {
      let id = $(event.target).attr("data-id");
      if (isEventCell) cell = eventTable.eventCells.find(cell => cell.id === id);
      else cell = eventTable.tableCells.find(cell => cell.id === id);
    }

    return cell;
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
