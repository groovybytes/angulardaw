import {AfterContentChecked, AfterContentInit, AfterViewInit, Component, ContentChild, OnInit} from "@angular/core";
import {EventTableComponent} from "../event-table/event-table.component";

@Component({
  selector: 'drag-container',
  templateUrl: './drag-container.component.html',
  styleUrls: ['./drag-container.component.scss']
})
export class DragContainerComponent implements OnInit,AfterViewInit{
  @ContentChild("et") eventTable:EventTableComponent;

  private btnWasUp:boolean=false;
  private isDragging:boolean=false;
  private jqCells:JQuery;

  ngOnInit(): void {
    $(document).on("mousemove",()=>{
      if (this.isDragging){
        console.log("its dragging");
      }
    });

    $(document).on("mouseup",()=>{
      this.btnWasUp=true;
      this.isDragging=false;
    });

  }

  ngAfterViewInit(): void {

    this.jqCells=$(this.eventTable.cellChildren.map(cell=>cell.nativeElement));
    this.jqCells.on("click",()=>console.log("click"));
    this.jqCells.on("dblclick",()=>{
      console.log("dbl click")
    });
    this.jqCells.on("mousedown",()=>{
      this.btnWasUp=false;
      setTimeout(()=>{
        this.isDragging=(this.btnWasUp===false);
      },200);
      event.stopPropagation();

      return false; //return false to avoid browser dragging

    });
    this.jqCells.on("click",()=>{
    })
  }

}
