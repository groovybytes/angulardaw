import {Directive, ElementRef, Input, NgZone, OnInit, Renderer2} from '@angular/core';
declare var interact;

@Directive({
  selector: '[interact-draggable]'
})
export class DraggableDirective implements OnInit {


  @Input("parent") parent:string;
 /* @Input("x") x:number;
  @Input("y") y:number;*/

  constructor(private element: ElementRef,private zone:NgZone) {

  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(()=>{
      interact(this.element.nativeElement)
        .draggable({
          // enable inertial throwing
          inertia: true,
          /*  allowFrom: '.drag-handle',*/
          // keep the element within the area of it's parent
          restrict: {
            restriction: this.parent,
            endOnly: false,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          // enable autoScroll
          autoScroll: false,

          // call this function on every dragmove event
          onmove: dragMoveListener,
          // call this function on every dragend event
          onend: function (event) {
          }
        })
    })


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
    }

    // this is used later in the resizing and gesture demos
    window["dragMoveListener"] = dragMoveListener;
  }

}
