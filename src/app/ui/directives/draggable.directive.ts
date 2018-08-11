import {Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as $ from "jquery";
import 'jqueryui';

@Directive({
  selector: '[jquery-ui-draggable]'
})
export class DraggableDirective implements OnInit,OnChanges {

  @Input() params;
  constructor(private element: ElementRef) {

  }

  ngOnInit(): void {
    //$(this.element.nativeElement).draggable({grid: [ 100, 50 ]});

  }

  ngOnChanges(changes: SimpleChanges): void {
    $(this.element.nativeElement).draggable(this.params);
  }


}
