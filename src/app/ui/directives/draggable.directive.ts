import {Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as $ from "jquery";
import 'jqueryui';
import DraggableOptions = JQueryUI.DraggableOptions;
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;

@Directive({
  selector: '[jquery-ui-draggable]'
})
export class DraggableDirective implements OnInit, OnChanges {

  //@Input() params: DraggableOptions;
  @Input() gridX: number=1;
  @Input() gridY: number=1;
  @Input() data: any;
  @Output() onDrag: EventEmitter<{ event: Event, ui: DraggableEventUIParams, data: any }> = new EventEmitter();
  @Output() onDragStart: EventEmitter<{ event: Event, ui: DraggableEventUIParams, data: any }> = new EventEmitter();

  constructor(private element: ElementRef) {

  }

  ngOnInit(): void {


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.params && changes.params.firstChange) {
      $(this.element.nativeElement).draggable( {
        drag: (event: Event, ui: DraggableEventUIParams) => {
          //$(this.element.nativeElement).draggable("option", {snap:false});
          this.onDrag.emit({event: event, ui: ui, data: this.data});
        },
        start: (event: Event, ui: DraggableEventUIParams) => {
          //$(this.element.nativeElement).draggable("option", {snap:".snap-cell"});
          this.onDragStart.emit({event: event, ui: ui, data: this.data})
        }
      })
    }
    else $(this.element.nativeElement).draggable("option", {grid:[this.gridX,this.gridY]});
  }


}
