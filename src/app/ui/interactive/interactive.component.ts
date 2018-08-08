import {Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import * as $ from "jquery";
import {EventCell} from "../../sequencer/model/EventCell";


@Component({
  selector: 'interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements OnInit {

  private isDragging: boolean = false;

  @Input() cell:EventCell;
  @Input() snapClass: string;
  @Input() container: string;

  @HostBinding('style.width.px')
  @Input() tickWidth: number = 50;

  @HostBinding('style.height.px')
  @Input() tickHeight: number = 50;

  @Output() positionChanged:EventEmitter<any>=new EventEmitter<any>();
  @Output() componentClicked:EventEmitter<any>=new EventEmitter<any>();

  private scrollX:number=0;
  private scrollY:number=0;

  private jqElement:JQuery;

  constructor(private element: ElementRef) {

  }

  ngOnInit() {

    this.jqElement=$(this.element.nativeElement);
    $(window).on("mouseup", () => this.isDragging = false);
    $(this.jqElement).on("mousedown", () => this.isDragging = true);
    $(this.container).on("scroll",(event)=>{
      this.scrollX=event.target.scrollLeft;
      this.scrollY=event.target.scrollTop;
      this.updatePosition();

    });
    this.jqElement.closest(this.container).on("mousemove", (event: any) => {
      if (this.isDragging && $(event.target).hasClass(this.snapClass)) {
        let elementLeft = this.element.nativeElement.getBoundingClientRect().left;
        let elementTop = this.element.nativeElement.getBoundingClientRect().top;
        let targetLeft = event.target.getBoundingClientRect().left;
        let targetTop = event.target.getBoundingClientRect().top;
        let positionChanged:boolean=false;
        if (elementLeft !== targetLeft) {
          let diff = targetLeft - elementLeft;
          this.cell.x +=diff;

          if (diff < 0) this.cell.column-=1;
          else this.cell.column+=1;
          positionChanged=true;
        }
        if (elementTop !== targetTop) {
          this.cell.y += targetTop - elementTop;
          positionChanged=true;
        }

        if (positionChanged){
          this.positionChanged.emit();
          this.updatePosition();
        }
      }
    });

    this.updatePosition();


  }

  onClick(event):void{
    this.componentClicked.emit(event);
  }
  private updatePosition():void{
    this.jqElement.css("left",(this.cell.x-this.scrollX)+"px");
    this.jqElement.css("top",(this.cell.y-this.scrollY)+"px");
  }
}
