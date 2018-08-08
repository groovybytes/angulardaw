/*
import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import * as interact from "interactjs";

@Directive({
  selector: '[interact]'
})
export class InteractDirective implements OnInit {


  @Input("parent") parent:string;
  @Input("x") x:number;
  @Input("y") y:number;

  constructor(private element: ElementRef,
              private renderer: Renderer2) {

  }

  ngOnInit(): void {
   /!* if (this.x && this.y){
      this.renderer.setAttribute(this.element.nativeElement,"data-x",this.x.toString());
      this.renderer.setAttribute(this.element.nativeElement,"data-y",this.y.toString());
      this.renderer.setStyle(this.element.nativeElement,"transform","translate("+this.x+"px,"+this.y+"px");
    }



    let dragMoveListener =(event)=> {
     /!* this.renderer.removeAttribute(this.element.nativeElement,"data-x");
      this.renderer.removeAttribute(this.element.nativeElement,"data-y");*!/
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


    let gridTarget = interact.createSnapGrid({
      x: 50,
      y: 50,
      range: Infinity,
      offset: { x: 0, y: 0 }
    });
    interact(this.element.nativeElement)
      .draggable({
        snap: { targets: [gridTarget] },
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
          restriction: this.parent,
          endOnly: false,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
       /!*   var textEl = event.target.querySelector('p');

          textEl && (textEl.textContent =
            'moved a distance of '
            + (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
            Math.pow(event.pageY - event.y0, 2) | 0))
              .toFixed(2) + 'px');*!/
        }
      });



    // this is used later in the resizing and gesture demos
    if (!window["dragMoveListener"]) window["dragMoveListener"] = dragMoveListener;*!/
  }

}
*/
