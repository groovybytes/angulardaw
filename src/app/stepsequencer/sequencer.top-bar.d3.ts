import * as d3 from "d3";
import {TopBarInfo} from "./model/TopBarInfo";
import {TableDimensions} from "./model/TableDimensions";
import {CellEvents} from "./model/CellEvents";
import {CellInfo} from "./model/CellInfo";
import {TransportProxy} from "../model/daw/TransportProxy";

export class SequencerTopBarD3 {

  private mergeSelection;
  private container;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>,private transport:TransportProxy) {
    this.container = this.svgElement.append("g").attr("class", "top-bar");
  }


  render(model: Array<TopBarInfo>, dimensions: TableDimensions, cellEvents: CellEvents<CellInfo>): void {


    let bandWidthX = dimensions.getBandWidthX();
    let bandWidthY = dimensions.getBandWidthY();

    this.container.attr("transform", "translate(" + dimensions.left + "," + dimensions.top + ")");

    let join = this.container.selectAll(".cell").data(model, (d: TopBarInfo) => d.getId());

    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", (d:TopBarInfo) => d.getCssClass(this.transport.getPosition()));
    enterSelection
      .append("rect")
      .call(selection => cellEvents.apply(selection));

    enterSelection
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: TopBarInfo, i) => i)
      .attr("data-column", (d, i) => i % dimensions.nColumns())
      .classed("empty", (d: TopBarInfo) => true)
      .attr("transform", (d: TopBarInfo) => "translate(" + ((d.tick) * bandWidthX) + "," + 0 + ")")
      .selectAll("rect")
      .attr("width", dimensions.width + "px")
      .attr("height", dimensions.height + "px")
      .attr("class", "cell-visual");

    this.mergeSelection.selectAll("text")
      .text((d: TopBarInfo) => d.text)
      .attr("transform", "translate(" + dimensions.width / 2 + "," + dimensions.height / 2 + ")");


  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: TopBarInfo) => d.getCssClass(this.transport.getPosition()));
  }

}


