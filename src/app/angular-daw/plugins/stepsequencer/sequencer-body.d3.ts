import {ElementRef, EventEmitter} from "@angular/core";
import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";
import {TableDimensions} from "./model/TableDimensions";
import {CellEvents} from "./model/CellEvents";

export class SequencerBodyD3 {

  private mergeSelection;

  private container:any;
  constructor(private svgElement:  d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.container = this.svgElement.append("g").attr("class", "step-sequencer");
  }

  render(model: Array<CellInfo>, dimensions:TableDimensions,cellEvents:CellEvents<CellInfo>): void {

    let bandWidthX=dimensions.getBandWidthX();
    let bandWidthY=dimensions.getBandWidthY();

    this.container.attr("transform", "translate("+dimensions.left+","+dimensions.top+")");

    let join =  this.container.selectAll(".cell").data(model,(d:CellInfo)=>d.getId());
    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", d=>d.getCssClass())
    enterSelection
      .append("rect")
      .call(selection=>cellEvents.apply(selection));

    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: CellInfo) => d.getId())
      .attr("data-column", (d:CellInfo) => d.column)
      .attr("data-row", (d:CellInfo) => d.row)
      .classed("empty", (d: CellInfo) => true)
      .attr("transform", (d: CellInfo) => "translate(" + ((d.column) * bandWidthX) + "," + ((d.row) * bandWidthY) + ")")
      .selectAll("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("class", "cell-visual")


  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: CellInfo) => d.getCssClass());
  }

  highlightColumn(column:number):void{
    this.mergeSelection.classed("position-focused",false);
    this.mergeSelection.filter((d:CellInfo)=>d.column===column).classed("position-focused",true)
  };


}


