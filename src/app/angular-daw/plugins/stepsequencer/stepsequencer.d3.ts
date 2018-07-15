import {ElementRef, EventEmitter} from "@angular/core";
import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";
import {TableDimensions} from "./model/TableDimensions";
import {CellEvents} from "./model/CellEvents";

export class StepsequencerD3 {

  private mergeSelection;

  constructor(private svgElement:  d3.Selection<SVGElement, {}, HTMLElement, any>) {

  }

  render(model: Array<CellInfo>, dimensions:TableDimensions,cellEvents:CellEvents<CellInfo>): void {

    let container = this.svgElement.append("g").attr("class", "step-sequencer");

    let bandWidthX=dimensions.getBandWidthX();
    let bandWidthY=dimensions.getBandWidthY();

    container.attr("transform", "translate("+dimensions.left+","+dimensions.top+")");

    let join = container.selectAll(".cell-container").data(model);

    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", d=>d.getCssClass())
    enterSelection
      .append("rect")
      .call(selection=>cellEvents.apply(selection));


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: CellInfo,i) => i)
      .attr("data-column", (d, i) => i % dimensions.nRows())
      .attr("data-row", (d, i) => Math.floor(i / dimensions.nRows()))
      .classed("empty", (d: CellInfo) => true)
      .attr("transform", (d: CellInfo) => "translate(" + ((d.column) * bandWidthX) + "," + ((d.row) * bandWidthY) + ")")
      .selectAll("rect")
      .attr("width", dimensions.width+"px")
      .attr("height", dimensions.height+"px")
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


