import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";
import {CellEvents} from "./model/CellEvents";
import {RowBarInfo} from "./model/RowBarInfo";
import {TopBarInfo} from "./model/TopBarInfo";
import {Project} from "../model/daw/Project";
import {SequencerBodyD3} from "./sequencer-body.d3";
import {SequencerRowBarD3} from "./sequencer.row-bar.d3";
import {SequencerTopBarD3} from "./sequencer.top-bar.d3";
import {MusicMath} from "../model/utils/MusicMath";
import {EventEmitter} from "@angular/core";
import {SequencerDimensions} from "./model/SequencerDimensions";
import {SequencerEvent} from "./model/SequencerEvent";
import {Subscription} from "rxjs/internal/Subscription";
import {Drums} from "../model/daw/plugins/Drums";
import {TransportPosition} from "../model/daw/TransportPosition";

export class SequencerD3 {


  newNote: EventEmitter<{ note: string, time: number, row: number }> = new EventEmitter<{ note: string, time: number, row: number }>();
  eventClicked: EventEmitter<SequencerEvent> = new EventEmitter<SequencerEvent>();

  private bodyClickSubscription: Subscription;
  private eventClickSubscription: Subscription;

  constructor(
    private project: Project,
    private svgElement: d3.Selection<SVGElement, {}, HTMLElement, any>,
    private drumKit: Drums,
    private sequencerEvents: CellEvents<CellInfo>,
    private barEvents: CellEvents<CellInfo>,
    private bodyRenderer: SequencerBodyD3,
    private rowBarRenderer: SequencerRowBarD3,
    private topBarRenderer: SequencerTopBarD3,
    private events: Array<SequencerEvent>
  ) {

  }

  render(data: Array<CellInfo>): void {
    let tickTime = MusicMath.getTickTime(this.project.transportParams.bpm, this.project.transportParams.quantization);
    /*let columns = data.filter(d => d.row === 0).length;
    let cellWidth = 50 * 4 * this.project.quantization;
    let cellHeight = 50;
    let padding = cellWidth / 20;
    let offsets = {
      top: 100,
      left: 0,
      headerBarHeight:100,
      rowBarWidth:100,
      padding:20,
      sequencerOffsetX: cellWidth * 2.5
    };*/
    let dimensions = new SequencerDimensions();
    dimensions.padding = 10;
    dimensions.top = 100;
    dimensions.left = 100;
    dimensions.cellHeight = 50;
    dimensions.cellWidth = 50 * 4 * this.project.transportParams.quantization;
    dimensions.cellPadding = 0;
    dimensions.headerBarHeight = 50;
    dimensions.rowBarWidth = 100;
    dimensions.columns = data.filter(d => d.row === 0).length;
    dimensions.rows = Math.ceil(data.length / dimensions.columns);
    dimensions.bodyHeight = dimensions.rows * dimensions.cellHeight;
    dimensions.bodyWidth = dimensions.columns * dimensions.cellWidth;


    this.svgElement
      .attr("width", (dimensions.rowBarWidth + dimensions.bodyWidth + dimensions.left))
      .attr("height", (dimensions.headerBarHeight + dimensions.bodyHeight + dimensions.top) * 1.2)
      .on("click", () => {
        let x = d3.event.x;
        let y = d3.event.y;

      });

    this.bodyRenderer.render(this.events, dimensions, this.sequencerEvents, tickTime);
    this.bodyRenderer.updatePosition(0);
    if (!this.bodyClickSubscription) this.bodyClickSubscription = this.bodyRenderer.bodyClick.subscribe((event) => {

      let width = dimensions.bodyWidth;
      let ticks = width / dimensions.cellWidth;
      let fullTime = tickTime * ticks;
      let dim = event.target.getBoundingClientRect();
      let x = event.clientX - dim.left;
      let y = event.clientY - dim.top;
      let row = Math.floor(y / dimensions.cellHeight);

      let time = x / width * fullTime;
      let column = MusicMath.getTickForTime(time, this.project.transportParams.bpm, this.project.transportParams.quantization);
      let cell = data.filter(d => d.row === row && d.column === column)[0];
      let quantizedTime = column * tickTime;
      this.newNote.emit({
        note: cell.note,
        time: quantizedTime,
        row: row
      });
    });

    if (!this.eventClickSubscription) this.eventClickSubscription = this.bodyRenderer.eventClick.subscribe((event: SequencerEvent) => {
      this.eventClicked.emit(event);
    });
    this.rowBarRenderer.render(
      data.filter(d => d.column === 0).map((d, i) => {
        return new RowBarInfo(i, d.note, d.note);
      }),
      dimensions,
      this.barEvents);

    this.topBarRenderer.render(
      data.filter(d => d.row === 0).map((d, i) => {
        let text = d.position.beat !== -1 ? (d.position.beat + 1).toString() : "";
        return new TopBarInfo(i, text);
      }),
      dimensions,
      this.barEvents);
  }


  updatePosition(position:TransportPosition): void {
    this.bodyRenderer.updatePosition(position.time);
    this.topBarRenderer.updateState(position);
  }


}


