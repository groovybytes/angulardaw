import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";
import {CellEvents} from "./model/CellEvents";
import {TransportProxy} from "../model/daw/TransportProxy";
import {TrackEvent} from "../model/daw/TrackEvent";
import {SequencerDimensions} from "./model/SequencerDimensions";
import {EventEmitter} from "@angular/core";
import {Note} from "../model/mip/Note";
import {SequencerEvent} from "./model/SequencerEvent";

export class SequencerBodyD3 {

  private mergeSelection;
  private cursor;
  private dimensions: SequencerDimensions;
  private events: Array<SequencerEvent>;
  private tickTime: number;
  private bgRectangle: any;
  bodyClick: EventEmitter<any> = new EventEmitter<any>();
  eventClick: EventEmitter<SequencerEvent> = new EventEmitter<SequencerEvent>();

  private container: any;

  constructor(private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>, private transport: TransportProxy) {
    this.container = this.svgElement.append("g").attr("class", "step-sequencer");

  }

  render(events: Array<SequencerEvent>, dimensions: SequencerDimensions, cellEvents: CellEvents<CellInfo>, tickTime: number): void {

    let width = dimensions.bodyWidth;
    let ticks = width / dimensions.cellWidth;
    let fullTime = tickTime * ticks;
    this.events = events;
    this.tickTime = tickTime;
    this.dimensions = dimensions;

    /*  dimensions.getRangeY()/dimensions.nColumns();
      this.dimensions = dimensions;
      let bandWidthX = dimensions.getBandWidthX();
      let bandWidthY = dimensions.getBandWidthY();*/

    this.container.attr("transform", "translate(" + (dimensions.left + dimensions.rowBarWidth) + "," + (dimensions.top + dimensions.headerBarHeight) + ")");

    let join = this.container.selectAll(".event-rect").data(events);//, (d: TrackEvent<any>) => d.);
    join.exit().remove();

    let enterSelection = join.enter()
      .append("rect")
      .attr("class", "event-rect")
      .on("click", (d) => {

        this.eventClick.emit(d);
      });


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection
      .attr("transform", (d: SequencerEvent) => {
        return "translate(" + (d.trackEvent.time / fullTime * width) + "," + d.row * dimensions.cellHeight + ")";
      })
      .attr("width", this.dimensions.cellWidth)
      .attr("height", this.dimensions.cellHeight);


    if (!this.cursor) this.cursor = this.container.append("line").attr("class", "cursor")
      .attr("y2", this.dimensions.bodyHeight)
      .attr("y1", 0);

    if (!this.bgRectangle) {
      this.bgRectangle = this.container
        .append("rect")
        .attr("class", "bg-rect")
        .attr("width", dimensions.bodyWidth)
        .attr("height", dimensions.bodyHeight)
        .on("click", () => {
          this.bodyClick.emit(d3.event)
        });
    }
  }


  updatePosition(): void {
    let width = this.dimensions.bodyWidth;
    let ticks = width / this.dimensions.cellWidth;
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


