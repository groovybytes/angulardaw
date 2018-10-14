import {Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {NoteCell} from "./model/NoteCell";
import {Pattern} from "../shared/model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {SequencerService} from "./sequencer.service";

@Directive({
  selector: '[event-cell]'
})
export class EventCellDirective implements OnInit,OnDestroy{

  private jqElement:JQuery;

  @Input() cell:NoteCell;
  @Output() clicked:EventEmitter<NoteCell>;


  private btnWasUp:boolean=false;
  private isDragging:boolean=false;

  constructor(element:ElementRef,private sequencerService: SequencerService){
    this.jqElement=$(element.nativeElement);
  }
  ngOnInit(): void {

    $(document).on("mousemove",()=>{
      if (this.isDragging){
        console.log("its dragging");
      }
    });
    this.jqElement.on("dblclick",()=>{

    });
    this.jqElement.on("mousedown",()=>{
      this.btnWasUp=false;
      setTimeout(()=>{
        this.isDragging=(this.btnWasUp===false);
      },200);
      event.stopPropagation();

      return false; //return false to avoid browser dragging

    });
    $(document).on("mouseup",()=>{
      this.btnWasUp=true;
      this.isDragging=false;
    });
    this.jqElement.on("click",()=>{
    })
  }

  ngOnDestroy(): void {
    $(document).off("mousemove");
    this.jqElement.off("dblclick");
    this.jqElement.off("mousedown");
    this.jqElement.off("mouseup");
    this.jqElement.off("click");
  }

}
