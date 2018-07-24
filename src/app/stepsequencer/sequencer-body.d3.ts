import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";
import {TableDimensions} from "./model/TableDimensions";
import {CellEvents} from "./model/CellEvents";
import {TransportProxy} from "../model/daw/TransportProxy";

export class SequencerBodyD3 {

  private mergeSelection;
  private cursor;
  private dimensions: TableDimensions;
  private model: Array<CellInfo>;
  private tickTime: number;

  private container: any;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>, private transport: TransportProxy) {
    this.container = this.svgElement.append("g").attr("class", "step-sequencer");

  }

  render(model: Array<CellInfo>, dimensions: TableDimensions, cellEvents: CellEvents<CellInfo>, tickTime: number): void {
    this.model = model;
    this.tickTime = tickTime;
    this.dimensions = dimensions;
    let bandWidthX = dimensions.getBandWidthX();
    let bandWidthY = dimensions.getBandWidthY();

    this.container.attr("transform", "translate(" + dimensions.left + "," + dimensions.top + ")");

    let join = this.container.selectAll(".cell").data(model, (d: CellInfo) => d.getId());
    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", d => d.getCssClass())
    enterSelection
      .append("rect")
      .call(selection => cellEvents.apply(selection));

    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: CellInfo) => d.getId())
      .attr("data-column", (d: CellInfo) => d.column)
      .attr("data-row", (d: CellInfo) => d.row)
      .classed("empty", (d: CellInfo) => true)
      .attr("transform", (d: CellInfo) => "translate(" + ((d.column) * bandWidthX) + "," + ((d.row) * bandWidthY) + ")")
      .selectAll("rect")
      .attr("width", dimensions.width+dimensions.padding*2)
      .attr("height", dimensions.height+dimensions.padding*2)
      .attr("class", "cell-visual");


    if (!this.cursor) this.cursor = this.container.append("line").attr("class", "cursor")
      .attr("y2", this.dimensions.top+ this.dimensions.getRangeY())
      .attr("y1", 0);
  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: CellInfo) => d.getCssClass(this.transport.getPosition()));
  }

  updatePosition(): void {
    let width = this.dimensions.getRangeX();
    let ticks = this.dimensions.getRangeX() / this.dimensions.getBandWidthX();
    let fullTime = this.tickTime * ticks / 1000;
    let percentage = this.transport.getPosition().time / fullTime;
    let pxPosition = width * percentage;
    this.cursor
      .attr("x1", pxPosition)
      .attr("x2", pxPosition);
  }

 /* highlightColumn(column: number): void {
    this.mergeSelection.classed("position-focused", false);
    this.mergeSelection.filter((d: CellInfo) => d.column === column).classed("position-focused", true)
  };*/


}


