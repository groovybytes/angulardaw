import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import "jqueryui";
import DraggableEventUIParams = JQueryUI.DraggableEventUIParams;
import {NoteCell} from "../../sequencer2/model/NoteCell";


@Directive({
  selector: '[jquery-draggable]'
})
export class JqueryDraggableDirective implements OnInit,OnChanges {

  @Input() dragEnabled:boolean=false;
  @Input() draggedCell:NoteCell;
  @Output() jqDragStart:EventEmitter<void>=new EventEmitter();
  @Output() jqDragEnd:EventEmitter<NoteCell>=new EventEmitter();

 /* @Input() parent:string;

  @Output() resizeStart:EventEmitter<void>=new EventEmitter();
  @Output() resizeEnd:EventEmitter<EventTarget>=new EventEmitter();*/

  constructor(private element: ElementRef) {

  }

  ngOnInit(): void {


  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dragEnabled.firstChange) {
      $(this.element.nativeElement ).draggable({
        grid: [ 1, this.draggedCell.height ],
        stop: ( event: Event, ui: DraggableEventUIParams)=> {
          this.jqDragEnd.emit(this.draggedCell);
          this.draggedCell.x = ui.position.left;
          this.draggedCell.y = ui.position.top;
          $(event.target).css("z-index","1");


        },
        start: ( event: Event, ui: DraggableEventUIParams)=> {
          this.jqDragStart.emit();
          $(event.target).css("z-index","10")
        }
      });
    }
    if (this.dragEnabled) $( this.element.nativeElement).draggable( "enable" );
    else  $( this.element.nativeElement).draggable( "disable" );

  }

}
