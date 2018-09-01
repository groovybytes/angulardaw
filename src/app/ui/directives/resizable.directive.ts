import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

declare var interact; //import makes problems; typings are wrong

@Directive({
  selector: '[interact-resizable]'
})
export class ResizableDirective implements OnInit {


  @Input() parent:string;
  @Input() enabled:boolean=true;
  @Output() resizeStart:EventEmitter<void>=new EventEmitter();
  @Output() resizeEnd:EventEmitter<EventTarget>=new EventEmitter();

  constructor(private element: ElementRef) {

  }

  ngOnInit(): void {

    interact(this.element.nativeElement)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: false, top: false },
        restrictEdges: {
          outer: this.parent,
          endOnly: false,
        },
        enabled:true,//this.enabled,
        inertia: false,
        restrictSize: {
          min: { width: 10 },
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
      .on('resizemove',  (event)=> {

        var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

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
        this.resizeEnd.emit(event.target);
      })
      .on('resizestart',(event)=>{
        $(event.target).css("z-index","10")
        this.resizeStart.emit();
      })

  }

}
