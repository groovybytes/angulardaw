import {
  AfterContentInit,
  AfterViewInit,
  Component, ContentChild, ElementRef, HostBinding, Input, OnInit, ViewChild

} from '@angular/core';
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {WindowState} from "./WindowState";
import {WindowContent} from "./WindowContent";
import {DawPlugin} from "../../angular-daw/plugins/DawPlugin";


declare var interact: Function;

@Component({
  selector: 'window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss'],
  host: {'class': 'draggable'}

})
export class WindowComponent implements OnInit, AfterContentInit {

  private _x:number;
  private _y: number;

  state: BehaviorSubject<WindowState> = new BehaviorSubject<WindowState>(WindowState.CLOSED);
  @ContentChild("content") content: DawPlugin;// WindowContent;
  @HostBinding('style.z-index') zIndex: number = 1;


  @HostBinding('class.closed')
  get closed() {
    return this.state.getValue() === WindowState.CLOSED;
  }

  @HostBinding('class.minimized')
  get minimized() {
    return this.state.getValue() === WindowState.MINIMIZED;
  }

  @HostBinding('class.maximized')
  get maximized() {
    return this.state.getValue() === WindowState.MAXIMIZED;
  }

  @Input() @HostBinding('style.width') width: string = "400px";
  @Input() @HostBinding('style.height') height: string = "400px";
  @Input() title: string;
  @HostBinding('style.left.px') @Input()
  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this.element.nativeElement.setAttribute("data-x", value);
    this.element.nativeElement.style.transform = "translate(" + value + "px," + this.y + "px)";
    this._x = value;
  }
  @HostBinding('style.top.px') @Input()
  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this.element.nativeElement.setAttribute("data-y", value);
    this.element.nativeElement.style.transform = "translate(" + this.x + "px," + value + "px)";
    this._y = value;
  }



  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    let self = this;

    function dragMoveListener(event) {

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

    let x = interact(this.element.nativeElement)
      .draggable({
        // enable inertial throwing
        inertia: true,
        allowFrom: '.drag-handle',
        // keep the element within the area of it's parent
        restrict: {
          restriction: "parent",
          endOnly: false,
          elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
      })
      .on('dragstart', ()=>self.zIndex++)
      .on('dragend', ()=>self.zIndex--)
      .resizable({

        // resize from all edges and corners
        edges: {left: true, right: true, bottom: true, top: true},

        // keep the edges inside the parent
        restrictEdges: {
          outer: self.element.nativeElement,
          endOnly: true,
        },

        // minimum size
        restrictSize: {
          min: {width: 100, height: 50},
        },

        inertia: true,
      })
      .on('resizemove', function (event) {
        var target = self.element.nativeElement,
          x = (parseFloat(target.getAttribute('data-x')) || 0),
          y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        self.width = event.rect.width + 'px';
        self.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
          'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      });





    // this is used later in the resizing and gesture demos
    window["dragMoveListener"] = dragMoveListener;


  }

  minimize(): void {
    this.state.next(WindowState.MINIMIZED);
    this.zIndex--;
  }

  normalize(): void {
    this.state.next(WindowState.NORMAL);
  }

  maximize(): void {

    if (this.state.getValue() === WindowState.MAXIMIZED) this.state.next(WindowState.NORMAL);
    else {
      this.zIndex++;
      this.state.next(WindowState.MAXIMIZED);
    }
  }

  close(): void {
    this.state.next(WindowState.CLOSED);
    this.content.destroy();

  }

  ngAfterContentInit(): void {

  }


}
