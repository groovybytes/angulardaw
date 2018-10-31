
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
import {WindowSpecs} from "../../shared/model/daw/visual/desktop/WindowSpecs";
declare var interact;

@Directive({
  selector: '[interact]'
})
export class InteractDirective implements OnInit,OnChanges {

  @Input() parent:string="parent";
  @Input() enabled:boolean=true;
  @Input() window:WindowSpecs;
  /*@Output() positionXChanged:EventEmitter<number>=new EventEmitter();
  @Output() positionYChanged:EventEmitter<number>=new EventEmitter();*/


  constructor(private element: ElementRef,
              private renderer: Renderer2) {

  }

  ngOnInit(): void {

    this.element.nativeElement.style.webkitTransform =
      this.element.nativeElement.style.transform =
        'translate(' + this.window.x + 'px, ' + this.window.y + 'px)';

    // update the posiion attributes
    this.element.nativeElement.setAttribute('data-x', this.window.x);
    this.element.nativeElement.setAttribute('data-y', this.window.y);

    this.element.nativeElement.style.width  = this.window.width + 'px';
    this.element.nativeElement.style.height  = this.window.height + 'px';

    interact(this.element.nativeElement)
      .draggable({
        // enable inertial throwing
        inertia: true,
        enabled:this.enabled,
        allowFrom: '.drag-handle',
        // keep the element within the area of it's parent
        restrict: {
          restriction: this.parent,
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: false,
        endOnly: true,


        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
        }
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: false, top: false },
        restrictEdges: {
          outer: this.parent,
          endOnly: false,
        },
        enabled:this.enabled,
        inertia: false,
        restrictSize: {
          min: { width: 10 },
        },
        axis: 'x',
        snapSize: {
          targets: [
            // snap the width and height to multiples of 100 when the element size
            // is 25 pixels away from the target size
            { width: 50, range: 10 },
          ]
        }
      })
      .on('resizemove',  (event)=> {

        var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        this.window.width=event.rect.width;
        this.window.height=event.rect.height;

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      })
      .on('resizeend',(event)=>{
        $(event.target).css("z-index","1");
       // this.resizeEnd.emit(event.target);
      })
      .on('resizestart',(event)=>{
        $(event.target).css("z-index","10")
        //this.resizeStart.emit();
      })

    let self = this;
    function dragMoveListener (event) {
      var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      self.window.x=x;
      self.window.y=y;
    /*  self.positionXChanged.emit(x);
      self.positionYChanged.emit(y);*/

    }

    // this is used later in the resizing and gesture demos
    window["dragMoveListener"] = dragMoveListener;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes");
    interact(this.element.nativeElement)
      .draggable({enabled:this.enabled})
    console.log(changes);
  }

}
