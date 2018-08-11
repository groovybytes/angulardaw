import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core';
import * as $ from "jquery";
import {EventCell} from "../../sequencer/model/EventCell";
import {NoteTriggerDto} from "../../shared/api/NoteTriggerDto";
import {MusicMath} from "../../model/utils/MusicMath";
import {TransportService} from "../../shared/services/transport.service";
import {tick} from "@angular/core/testing";
import {Pattern} from "../../model/daw/Pattern";


@Component({
  selector: 'interactive',
  templateUrl: './interactive.component.html',
  styleUrls: ['./interactive.component.scss']
})
export class InteractiveComponent implements OnInit {

  private isDragging: boolean = false;
  @Input() patternLength: number;
  @Input() notes: Array<string>;
  @Input() cell: NoteTriggerDto;
  @Input() snapClass: string;


  /* @HostBinding('style.width.px')
   @Input() tickWidth: number = 50;

   @HostBinding('style.height.px')
   @Input() tickHeight: number = 50;*/

  @Output() positionChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() componentClicked: EventEmitter<any> = new EventEmitter<any>();

  private scrollX: number = 0;
  private scrollY: number = 0;

  private jqElement: JQuery;
  private jqContainer: JQuery;

  params = {
    offsetLeft: 0,
    offsetTop: 0,
    cellWidth: 0,
    cellHeight: 0,
    tickTime: 0,
    fullTime: 0,
    width: 0,
    percentage: 0,
    pxTime:0,
    positionX:0,
    positionY:0,
  };

  constructor(private element: ElementRef, private transportService: TransportService) {

  }


  ngOnInit() {
    this.jqElement = $(this.element.nativeElement);
    this.jqContainer = this.jqElement.offsetParent();

    $(window).on("mouseup", () => this.isDragging = false);
    this.jqElement.on("mousedown", () => this.isDragging = true);
    this.jqContainer.on("scroll", (event) => {
      this.scrollX = event.target.scrollLeft;
      this.scrollY = event.target.scrollTop;
      this.updatePosition();

    });
    this.jqContainer.on("mousemove", (event: JQuery.Event) => {


      if (this.isDragging){
        if (event.shiftKey){
          let offset=this.jqElement[0].getBoundingClientRect().left- this.jqContainer[0].getBoundingClientRect().left-this.params.offsetLeft;
          console.log(event.pageX);
          let xPosition = event.pageX-this.params.offsetLeft-this.params.cellWidth/2;//-this.element.nativeElement.getBoundingClientRect().left;
          let percentage = (xPosition)/this.params.width;
          this.cell.time=Math.round(this.params.fullTime*percentage);
          //console.log(xPosition/this.params.width   +"%");
          /*console.log(event.pageX);
          let delta=event.pageX+this.params.offsetLeft-this.params.positionX;
          this.cell.time+=delta*this.params.pxTime;
          this.params.positionX=event.pageX;*/
          this.updatePosition();
        }
        else if ( $(event.target).hasClass(this.snapClass)) {
          let elementLeft = this.element.nativeElement.getBoundingClientRect().left;
          let elementTop = this.element.nativeElement.getBoundingClientRect().top;
          let targetLeft = (<Element>event.target).getBoundingClientRect().left;
          let targetTop = (<Element>event.target).getBoundingClientRect().top;
          let positionChanged: boolean = false;
          if (elementLeft !== targetLeft) {
            let diff = targetLeft - elementLeft;
            if (diff > 0) this.cell.time += this.params.tickTime;
            else this.cell.time -= this.params.tickTime;
            this.updatePosition();
            /* console.log(this.cell.time);
            /!* if (diff < 0) this.cell.column -= 1;
             else this.cell.column += 1;*!/*/
            positionChanged = true;
          }
          if (elementTop !== targetTop) {
           // this.cell.y += targetTop - elementTop;
            positionChanged = true;
          }

        }
      }

    });

    setTimeout(() => {
      this.calculateParams();
      this.updatePosition();
    })


  }


  onClick(event): void {
    //this.componentClicked.emit(event);
  }

  private getTimeAt(positionInPx:number):number{


   /* let xPosition = event.pageX-this.params.offsetLeft-this.params.cellWidth/2;//-this.element.nativeElement.getBoundingClientRect().left;
    let percentage = (xPosition)/this.params.width;
    this.cell.time=Math.round(this.params.fullTime*percentage);*/
   return 0;
  }
  private getOffsetToContainer  ():number{
    return this.element.nativeElement.getBoundingClientRect().left-this.jqContainer[0].getBoundingClientRect().left;
  }
  private getOffsetToFirstColumn(): number {
    return this.jqContainer.find("[data-time='0']").first().offset().left - this.jqContainer.offset().left;
  }

  private getX(): number {
    return this.params.offsetLeft + this.params.width * this.params.percentage;
  }

  private getY(): number {
    return this.params.offsetTop + (this.notes.indexOf(this.cell.note)+1) * this.params.cellHeight;
  }

  private calculateParams(): void {
    let reference = this.jqContainer.find("[data-time='0']").first();
    this.params.offsetLeft = reference.offset().left - this.jqContainer.offset().left;
    this.params.offsetTop = reference.offset().top - this.jqContainer.offset().top;
    this.params.cellWidth = reference[0].getBoundingClientRect().width;
    this.params.cellHeight = reference[0].getBoundingClientRect().height;
    this.params.fullTime = MusicMath.getTimeAtBeat(this.patternLength, this.transportService.params.bpm
      , this.transportService.params.quantization);
    this.params.tickTime = MusicMath.getTickTime(this.transportService.params.bpm
      , this.transportService.params.quantization);

    this.params.width = MusicMath.getBeatTicks(this.transportService.params.quantization) * this.patternLength * this.params.cellWidth;
    this.params.pxTime=this.params.width/this.params.fullTime;

    //this.params.height=reference[0].getBoundingClientRect().height;


  }

  private calculateCurrentPositionParams(): void {

    this.params.percentage = this.cell.time / this.params.fullTime;
  }

  private updatePosition(): void {
    this.calculateCurrentPositionParams();
    this.jqElement.css("left", this.getX() + "px");
    this.jqElement.css("top", this.getY() + "px");
  }


}
