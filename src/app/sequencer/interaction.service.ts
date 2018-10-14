/*
import {NoteCell} from "./model/NoteCell";
import {SequencerService2} from "./sequencer2.service";
import {ElementRef, Injectable} from "@angular/core";
import {Cell} from "../shared/model/daw/matrix/Cell";
import {Pattern} from "../shared/model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";

@Injectable()
export class InterActionService {

  private isMouseUp: boolean = false;
  private isDragging: boolean = false;
  private isMoving: boolean = false;
  private currentCell: NoteCell;

  constructor(private sequencerService: SequencerService2) {

  }

  mouseDown(event:MouseEvent,cell: NoteCell, eventCells: Array<NoteCell>, pattern: Pattern, specs: SequencerD3Specs): void {
    this.currentCell = cell;
    this.isMouseUp = false;
    setTimeout(() => {
      if (!this.isMouseUp) {
        this.isMoving = true;
        cell.isDragging=true;
        //$("[data-id='" + cell.id + "']").css("pointer-events","none")
      }
      else {
        if (cell.column >= 0 && cell.row >= 0) {
          if (cell.data) this.sequencerService.removeEvent(eventCells, cell, pattern);
          else this.sequencerService.addNote(cell.x, cell.y, eventCells, specs, pattern);
        }
      }
    }, 200);
  }

  mouseOver(cell: NoteCell): void {
    cell.isDragTarget=this.isDragging;
  }

  mouseLeave(cell: NoteCell): void {
    cell.isDragTarget=false;
  }

  dblClick(cell: NoteCell): void {

  }

  mouseUp(): void {

    if (this.isDragging || this.isMoving) {
      this.isDragging = false;
      this.isMoving = false;
      this.isMouseUp = false;
      this.currentCell.isDragging=false;
      this.currentCell = null;
    }
    else {
      this.isMouseUp = true;
    }

  }

  mouseMove(container: ElementRef, event: MouseEvent): void {

    if (this.isMoving) {
      let offsetLeft = this.getOffsetLeft(container.nativeElement);
      this.currentCell.x = event.x - offsetLeft - this.currentCell.width / 2;
    }
  }

  getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
      if (!isNaN(elem.offsetLeft)) {
        offsetLeft += elem.offsetLeft;
      }
    } while (elem = elem.offsetParent);
    return offsetLeft;
  }

}
*/
