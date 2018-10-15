import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild, ElementRef,
  HostListener,
  OnInit
} from "@angular/core";
import {EventTableComponent} from "../event-table/event-table.component";
import {NoteCell} from "../model/NoteCell";
import {DragContainerService} from "./drag-container.service";

@Component({
  selector: 'drag-container',
  templateUrl: './drag-container.component.html',
  styleUrls: ['./drag-container.component.scss']
})
export class DragContainerComponent implements OnInit{
  @ContentChild("et") eventTable:EventTableComponent;

  @HostListener('click', ['$event']) onClick(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onClick(cell);
  }
  @HostListener('dblclick', ['$event']) onDblClick(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onDblClick(cell,this.eventTable);
  }
  @HostListener('mousedown', ['$event']) onMouseDown(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    return this.dragContainerService.onMouseDown(cell,event);
  }
  @HostListener('mouseup', ['$event']) onMouseUp(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseUp(cell);
  }
  @HostListener('mouseover', ['$event']) onMouseOver(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseOver(cell,this.eventTable.specs,this.eventTable.pattern);
  }
  @HostListener('mouseout', ['$event']) onMouseLeave(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseLeave(cell);
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event:MouseEvent) {
    this.dragContainerService.onMouseMove(event,this.element,this.eventTable.pattern,this.eventTable.specs);
  }

  constructor(private element:ElementRef,private dragContainerService:DragContainerService) {

  }

  ngOnInit(): void {

  }

}
