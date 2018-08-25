import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
declare var interact;

@Directive({
  selector: '[interact]'
})
export class InteractDirective implements OnInit {


  @Input("parent") parent:string;
 /* @Input("x") x:number;
  @Input("y") y:number;*/

  constructor(private element: ElementRef,
              private renderer: Renderer2) {

  }

  ngOnInit(): void {
    interact(this.element.nativeElement)
      .draggable({
        // enable inertial throwing
        inertia: true,
        allowFrom: '.drag-handle',
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
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
        restrictEdges: {
          outer: this.parent,
          endOnly: false,
        },
        inertia: false
      })
      .on('resizemove', function (event) {
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
      });

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
