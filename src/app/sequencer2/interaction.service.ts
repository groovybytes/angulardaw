import {NoteCell} from "./model/NoteCell";
import {SequencerService2} from "./sequencer2.service";
import {ElementRef, Injectable} from "@angular/core";
import {Cell} from "../shared/model/daw/matrix/Cell";
import {Pattern} from "../shared/model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";

@Injectable()
export class InterActionService {

  private isMouseUp:boolean=false;
  private isDragging:boolean=false;
  private currentCell:NoteCell;

  constructor(private sequencerService: SequencerService2) {

  }

  mouseDown(cell: NoteCell,eventCells:Array<NoteCell>,pattern:Pattern,specs:SequencerD3Specs): void {
    this.currentCell=cell;
    this.isMouseUp=false;
    setTimeout(()=>{
      if (!this.isMouseUp) this.isDragging=true;
      else{
        if (cell.column >= 0 && cell.row >= 0) {
          if (cell.data) this.sequencerService.removeEvent(eventCells, cell, pattern);
          else this.sequencerService.addNote(cell.x, cell.y, eventCells, specs, pattern);
        }
      }
    },200);
  }

  mouseUp(): void {
    console.log("mouse up");
    if (this.isDragging){
      this.isDragging=false;
      this.isMouseUp=false;
      this.currentCell=null;
    }
    else{
      this.isMouseUp=true;
    }

  }

  mouseMove(container:ElementRef,event:MouseEvent): void {
    console.log("mouse move");
    console.log(event);
     if (this.isDragging){
       console.log(container.nativeElement);
       //this.currentCell.x+=event.movementX;
       this.currentCell.x=event.x-container.nativeElement.getBoundingClientRect().left;
      // $(event.target).css("left",event.pageX+"px");
     }
  }

  resizeStart(): void {
    // this.isResizing = true;

  }

  dragStart(event: DragEvent, cell: Cell<any>): void {
    /* setTimeout(()=>{
       if (!this.isResizing)  this.dragHandler.onDragStart(event,cell);
     })*/
  }

  resizeEnd(cell: NoteCell): void {

    /*  setTimeout(() => {
        this.isResizing = false;
        this.sequencerService.onResized(cell, this.pattern, this.specs);
      }, 10);*/
  }
}
