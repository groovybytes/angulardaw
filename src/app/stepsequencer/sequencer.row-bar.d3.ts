import * as d3 from "d3";
import {RowBarInfo} from "./model/RowBarInfo";
import {CellEvents} from "./model/CellEvents";
import {CellInfo} from "./model/CellInfo";
import {SequencerDimensions} from "./model/SequencerDimensions";

export class SequencerRowBarD3 {

  private mergeSelection;
  private container;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>) {
    this.container = this.svgElement.append("g").attr("class", "row-bar");
  }

  render(model: Array<RowBarInfo>, dimensions: SequencerDimensions, cellEvents: CellEvents<CellInfo>): void {


    let bandWidthX = dimensions.getBandWidthX();
    let bandWidthY = dimensions.getBandWidthY();

    this.container.attr("transform", "translate(" + dimensions.left + "," + (dimensions.top+dimensions.headerBarHeight) + ")");

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
      .attr("data-column", (d, i) => i % dimensions.rows)
      .attr("data-row", (d, i) => Math.floor(i / dimensions.rows))
      .classed("empty", (d: RowBarInfo) => true)
      .attr("transform", (d: RowBarInfo) => "translate(0," + ((d.row) * dimensions.cellHeight) + ")")
      .selectAll("rect")
      .attr("width", dimensions.rowBarWidth)
      .attr("height", dimensions.cellHeight)

    this.mergeSelection.selectAll(".grid-line")
      .attr("x1", 0)
      .attr("x2", dimensions.rowBarWidth+dimensions.bodyWidth)
      .attr("y1", 0)
      .attr("y2", 0);

    this.mergeSelection.selectAll("text")
      .text((d: RowBarInfo) => d.text)
      .attr("transform", "translate(" + dimensions.cellWidth / 2 + "," + dimensions.cellHeight / 2 + ")");


  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: RowBarInfo) => d.getCssClass());
  }
}


