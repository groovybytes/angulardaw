import * as d3 from "d3";
import {NoteCell} from "./model/NoteCell";
import {Pattern} from "../model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {SequencerService} from "./sequencer.service";
import {TransportParams} from "../model/daw/TransportParams";
import {TransportEvents} from "../model/daw/events/TransportEvents";


export class SequencerD3 {


  private container: d3.Selection<SVGElement, any, any, any>;
  private pattern:Pattern;
  private cells:Array<NoteCell>;
  private joinData:any;
  private enterSelection:d3.Selection<SVGElement, any, any, any>;
  private positionIndicator:d3.Selection<SVGElement, any, any, any>;

  constructor(
    private svg: SVGElement,
    private specs: SequencerD3Specs,
    private transportEvents:TransportEvents,
    private transportParams:TransportParams,
    private sequencerService: SequencerService) {
    this.container = d3.select(svg).append("g");
    this.transportEvents.time.subscribe(time=>this.updatePosition(time));

  }

  render(pattern: Pattern, cells: Array<NoteCell>): void {

    this.pattern=pattern;
    this.cells=cells;

    let enterSelection = this.enter();
    this.merge();


  }

  private enter():void{
    d3.select(this.svg)
      .attr("width",this.specs.columns*this.specs.cellWidth+"px")
      .attr("height",this.specs.rows*this.specs.cellWidth+"px");

    this.joinData = this.container.selectAll(".note-cell").data(this.cells,(d:NoteCell)=>d.id);
    this.enterSelection = this.joinData.enter().append("g")
      .attr("data-id",(d:NoteCell)=>d.id)
      .attr("text-anchor","middle")
      .attr("class", "note-cell");

    this.enterSelection.append("rect").attr("class", "fill-rect");
    this.enterSelection.filter((d:NoteCell)=>d.header)
      .append("text")
      .attr("class","header-text")
      .attr("alignment-baseline","center")
      .attr("x",this.specs.cellWidth/2)
      .attr("y",this.specs.cellHeight/2)

    if (!this.positionIndicator){
      this.positionIndicator = this.container.append("line");
      this.positionIndicator.attr("class","position-indicator");
    }

  }

  private merge():void{

    let mergeSelection = this.enterSelection.merge(this.joinData);
    mergeSelection
      .attr("transform", (d: NoteCell) => "translate("+d.x+","+d.y+")")
      .classed("active",(d: NoteCell) => d.data != null)
      .classed("header",(d: NoteCell) => d.header)
      .selectAll("rect")
      .attr("width", (d: NoteCell) => d.width)
      .attr("height", (d: NoteCell) => d.height)
      .on("dblclick", (d: NoteCell) => {
        if (d.data) this.sequencerService.removeEvent(d,this.pattern);
        else this.sequencerService.addNote(d.x,d.y,this.cells,this.specs,this.pattern,this.transportParams);
        this.enter();
        this.merge();
      })

    mergeSelection.selectAll(".header-text")
      .text((d:NoteCell)=>d.beat+1!=0?d.beat+1:"");

    /*this.updatePosition(0);*/
  }

  updatePosition(time:number):void{
    let x = this.sequencerService.getXPositionForTime(time*1000,this.specs,this.pattern,this.transportParams);
    this.positionIndicator
      .attr("x1",x)
      .attr("x2",x)
      .attr("y1",0)
      .attr("y2",200)
  }
}
