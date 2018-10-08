import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NoteCell} from "../../sequencer2/model/NoteCell";


declare var interact; //import makes problems; typings are wrong

@Directive({
  selector: '[interact-resizable]'
})
export class ResizableDirective implements OnInit {

  @Input() cell:NoteCell;
  @Input() initialY:number;
  @Input() parent: string;
  @Input() enabled: boolean = true;
  @Output() resizeStart: EventEmitter<void> = new EventEmitter();
  @Output() resizeEnd: EventEmitter<NoteCell> = new EventEmitter();

  constructor(private element: ElementRef) {

  }

  ngOnInit(): void {

    interact(this.element.nativeElement)
      .resizable({
        // resize from all edges and corners
        edges: {left: true, right: true, bottom: false, top: false},
        restrictEdges: {
          outer: this.parent,
          endOnly: false,
        },
        enabled: true,//this.enabled,
        inertia: false,
        restrictSize: {
          min: {width: 10},
        },
        axis: 'x',
        snapSize: {
          /* targets: [
             // snap the width and height to multiples of 100 when the element size
             // is 25 pixels away from the target size
             { width: 50, range: 10 },
           ]*/
        }
      })
      .on('resizemove', (event) => {

        let target = event.target;

        // update the element's style
        this.cell.width=event.rect.width;
        this.cell.height=event.rect.height;

        // translate when resizing from top or left edges
        this.cell.x += event.deltaRect.left;
        this.cell.y += event.deltaRect.top;
      })
      .on('resizeend', (event) => {
        $(event.target).css("z-index", "1");
        this.resizeEnd.emit(this.cell);
      })
      .on('resizestart', (event) => {
        $(event.target).css("z-index", "10")
        this.resizeStart.emit();
      })

  }

}
