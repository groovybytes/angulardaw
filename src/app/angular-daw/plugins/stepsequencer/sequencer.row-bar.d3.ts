import {ElementRef, EventEmitter} from "@angular/core";
import * as d3 from "d3";
import {RowBarInfo} from "./model/RowBarInfo";
import {TableDimensions} from "./model/TableDimensions";
import {CellEvents} from "./model/CellEvents";
import {CellInfo} from "./model/CellInfo";

export class SequencerRowBarD3 {

  private mergeSelection;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>) {

  }

  render(model: Array<RowBarInfo>, dimensions:TableDimensions,cellEvents:CellEvents<CellInfo>): void {
    let container = this.svgElement.append("g").attr("class", "row-bar");

    let bandWidthX=dimensions.getBandWidthX();
    let bandWidthY=dimensions.getBandWidthY();

    container.attr("transform", "translate("+dimensions.left+","+dimensions.top+")");

    let join = container.selectAll(".cell-container").data(model);

    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", d=>d.getCssClass());
    enterSelection
      .append("rect")
      .call(selection=>cellEvents.apply(selection));

    enterSelection
      .append("text")
      .attr("text-anchor","middle")
      .attr("alignment-baseline","middle")


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: RowBarInfo,i) => i)
      .attr("data-column", (d, i) => i % dimensions.nRows())
      .attr("data-row", (d, i) => Math.floor(i / dimensions.nRows()))
      .classed("empty", (d: RowBarInfo) => true)
      .attr("transform", (d: RowBarInfo) => "translate(" + (bandWidthX) + "," + ((d.row) * bandWidthY) + ")")
      .selectAll("rect")
      .attr("width", dimensions.width+"px")
      .attr("height", dimensions.height+"px")
      .attr("class", "cell-visual");

    this.mergeSelection.selectAll("text")
      .text((d:RowBarInfo)=>d.text)
      .attr("transform","translate("+dimensions.width/2+","+dimensions.height/2+")");


  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: RowBarInfo) => d.getCssClass());
  }
}


