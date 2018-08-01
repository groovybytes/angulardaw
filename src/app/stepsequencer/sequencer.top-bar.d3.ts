import * as d3 from "d3";
import {TopBarInfo} from "./model/TopBarInfo";
import {CellEvents} from "./model/CellEvents";
import {CellInfo} from "./model/CellInfo";
import {SequencerDimensions} from "./model/SequencerDimensions";
import {TransportPosition} from "../model/daw/TransportPosition";

export class SequencerTopBarD3 {

  private mergeSelection;
  private container;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.container = this.svgElement.append("g").attr("class", "top-bar");
  }


  render(model: Array<TopBarInfo>, dimensions: SequencerDimensions, cellEvents: CellEvents<CellInfo>): void {

    let bandWidthX = dimensions.getBandWidthX();

    this.container.attr("transform", "translate(" + (dimensions.left+dimensions.rowBarWidth) + "," + dimensions.top + ")");

    let join = this.container.selectAll(".cell").data(model, (d: TopBarInfo) => d.getId());

    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", (d:TopBarInfo) => d.getCssClass(new TransportPosition()));
    enterSelection
      .append("rect")
      .call(selection => cellEvents.apply(selection));

    enterSelection.append("line").attr("class","grid-line");

    enterSelection
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: TopBarInfo, i) => i)
      .attr("data-column", (d, i) => i % dimensions.columns)
      .classed("empty", (d: TopBarInfo) => true)
      .attr("transform", (d: TopBarInfo) => "translate(" + ((d.tick) * dimensions.cellWidth) + "," + 0 + ")")
      .selectAll("rect")
      .attr("width", dimensions.cellWidth)
      .attr("height", dimensions.headerBarHeight)
      .attr("class", "cell-visual");

    this.mergeSelection.selectAll(".grid-line")
      .attr("x1",0)
      .attr("x2",0)
      .attr("y1",dimensions.headerBarHeight)
      .attr("y2",dimensions.headerBarHeight+dimensions.bodyHeight)

    this.mergeSelection.selectAll("text")
      .text((d: TopBarInfo) => d.text)
      .attr("transform", "translate(" + dimensions.cellWidth / 2 + "," + dimensions.cellHeight / 2 + ")");


  }

  updateState(position:TransportPosition): void {
    this.mergeSelection.attr("class", (d: TopBarInfo) => d.getCssClass(position));
  }

}


