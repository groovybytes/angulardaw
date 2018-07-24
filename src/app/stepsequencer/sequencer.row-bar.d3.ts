import * as d3 from "d3";
import {RowBarInfo} from "./model/RowBarInfo";
import {TableDimensions} from "./model/TableDimensions";
import {CellEvents} from "./model/CellEvents";
import {CellInfo} from "./model/CellInfo";

export class SequencerRowBarD3 {

  private mergeSelection;
  private container;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.container = this.svgElement.append("g").attr("class", "row-bar");
  }

  render(model: Array<RowBarInfo>, dimensions: TableDimensions, offsets, bodyWidth: number, cellEvents: CellEvents<CellInfo>): void {


    let bandWidthX = dimensions.getBandWidthX();
    let bandWidthY = dimensions.getBandWidthY();

    this.container.attr("transform", "translate(" + dimensions.left + "," + dimensions.top + ")");

    let join = this.container.selectAll(".cell").data(model, (d: RowBarInfo) => d.getId());

    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", d => d.getCssClass());
    enterSelection
      .append("rect")
      .attr("class", "bg-row-bar")
      .call(selection => cellEvents.apply(selection));

    enterSelection.append("line").attr("class", "grid-line");

    enterSelection
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: RowBarInfo, i) => i)
      .attr("data-column", (d, i) => i % dimensions.nRows())
      .attr("data-row", (d, i) => Math.floor(i / dimensions.nRows()))
      .classed("empty", (d: RowBarInfo) => true)
      .attr("transform", (d: RowBarInfo) => "translate(" + (bandWidthX) + "," + ((d.row) * bandWidthY) + ")")
      .selectAll("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    this.mergeSelection.selectAll(".grid-line")
      .attr("x1", offsets.sequencerOffsetX)
      .attr("x2", bodyWidth * 1.2 + dimensions.left)
      .attr("y1", 0)
      .attr("y2", 0)

    this.mergeSelection.selectAll("text")
      .text((d: RowBarInfo) => d.text)
      .attr("transform", "translate(" + dimensions.width / 2 + "," + dimensions.height / 2 + ")");


  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: RowBarInfo) => d.getCssClass());
  }
}


