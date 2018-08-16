import {Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as $ from "jquery";
import 'jqueryui';
import DraggableOptions = JQueryUI.DraggableOptions;

@Directive({
  selector: '[jquery-ui-draggable]'
})
export class DraggableDirective implements OnInit, OnChanges {

  @Input() params: DraggableOptions;

  constructor(private element: ElementRef) {

  }

  ngOnInit(): void {
    //$(this.element.nativeElement).draggable({grid: [ 100, 50 ]});

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.params.firstChange) {
      $(this.element.nativeElement).draggable(this.params);
    }

  }


}
