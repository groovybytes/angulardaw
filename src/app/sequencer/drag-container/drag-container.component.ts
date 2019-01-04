import {Component, ElementRef, HostListener, Inject, OnInit} from "@angular/core";
import {MouseGesturesService} from "../mousetrap/mouse-gestures.service";
import {MouseTrapEvents} from "../mousetrap/MouseTrapEvents";
import {MouseTrapEvent} from "../mousetrap/MouseTrapEvent";


@Component({
  selector: 'drag-container',
  templateUrl: './drag-container.component.html',
  styleUrls: ['./drag-container.component.scss'],
  providers:[MouseGesturesService]
})
export class DragContainerComponent implements OnInit{
 /* @ContentChild("et") eventTable:EventTableComponent;*/

/*  @HostListener('click', ['$event']) onClick(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onClick(cell);
  }
  @HostListener('dblclick', ['$event']) onDblClick(event:MouseEvent) {
    let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onDblClick(cell,this.eventTable);
  }*/
  @HostListener('mousedown', ['$event']) onMouseDown(event:MouseEvent) {

    return this.mouseGesturesService.mouseDown(event);
   /* let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    return this.dragContainerService.onMouseDown(cell,event);*/
  }
  @HostListener('document:mouseup', ['$event']) onMouseUp(event:MouseEvent) {


    return this.mouseGesturesService.mouseUp(event);
   /* let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseUp(cell);*/
  }
  @HostListener('mouseover', ['$event']) onMouseOver(event:MouseEvent) {
    this.mouseEvents.mouseOver.emit(new MouseTrapEvent(event));
   /* let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseOver(cell,this.eventTable.specs,this.eventTable.pattern);*/
  }
  @HostListener('mouseout', ['$event']) onMouseLeave(event:MouseEvent) {
    this.mouseEvents.mouseOut.emit(new MouseTrapEvent(event));
  /*  let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseLeave(cell);*/
  }
  @HostListener('document:mousemove', ['$event']) onMouseMove(event:MouseEvent) {

    return this.mouseGesturesService.mouseMove(event,this.element);
   // this.mouseEvents.mouseMove.emit(<HTMLElement>event.target);
 /*   let cell = this.dragContainerService.getEventCell(event,this.eventTable);
    this.dragContainerService.onMouseMove(event,cell,this.element,this.eventTable.pattern,this.eventTable.specs);*/
  }


  constructor(
    private element:ElementRef,
    @Inject("MouseEvents") private mouseEvents:MouseTrapEvents,
    private mouseGesturesService:MouseGesturesService) {
  }

  ngOnInit(): void {

  }

}
