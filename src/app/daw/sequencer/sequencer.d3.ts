import * as d3 from "d3";
import {NoteCell} from "./model/NoteCell";
import {Pattern} from "../model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {SequencerService} from "./sequencer.service";
import {Track} from "../model/daw/Track";
import {Subscription} from "rxjs/internal/Subscription";
import {MusicMath} from "../model/utils/MusicMath";
import {DragBehavior} from "d3";

export class SequencerD3 {


  private container: d3.Selection<SVGElement, any, any, any>;
  private pattern: Pattern;
  private cells: Array<NoteCell>;
  private joinData: any;
  private enterSelection: d3.Selection<SVGElement, any, any, any>;
  private mergeSelection: d3.Selection<SVGElement, any, any, any>;
  private positionIndicator: d3.Selection<SVGElement, any, any, any>;
  private timeSubscription: Subscription;
  private isDoubleClick:boolean=false;
  private drag:DragBehavior<any,any,any>;

  constructor(
    private svg: SVGElement,
    private specs: SequencerD3Specs,
    private track: Track,
    private sequencerService: SequencerService) {

    this.container = d3.select(svg).append("g");

    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

    this.drag=d3.drag()
      .on("start", (d: NoteCell) => this.sequencerService.dragStart(d,this.mergeSelection))
      .on("drag", (d: NoteCell) => this.sequencerService.drag(d,this.cells,this.mergeSelection))
      .on("end", (d: NoteCell) => {
        this.sequencerService.dragEnd(d,this.cells,this.mergeSelection,this.pattern,this.specs);
        this.enter();
        this.merge();
      });



  }

  render(pattern: Pattern, cells: Array<NoteCell>): void {

    this.pattern = pattern;

    this.cells = cells;

    let enterSelection = this.enter();
    this.merge();
    if (!this.timeSubscription) this.timeSubscription = this.track.transport.time.subscribe(time => {
      this.updatePosition(time)
    });

  }

  private enter(): void {
    d3.select(this.svg)
      .attr("width", this.specs.columns * this.specs.cellWidth + "px")
      .attr("height", this.specs.rows * this.specs.cellWidth + "px");


    if (!this.positionIndicator) {
      this.positionIndicator = this.container.append("line");
      this.positionIndicator.attr("class", "position-indicator");
    }
    this.joinData = this.container.selectAll(".note-cell").data(this.cells, (d: NoteCell) => d.id);
    this.enterSelection = this.joinData.enter().append("g");
    this.enterSelection.call(this.drag);
    let enterContainer = this.enterSelection
      .attr("text-anchor", "middle")
      .attr("class", "note-cell")

    enterContainer
      .append("rect")
      .attr("class", "fill-rect")
      .on("dblclick", (d: NoteCell) => {
        this.isDoubleClick=true;
        if (d.data) this.sequencerService.removeEvent(d, this.pattern);
        else this.sequencerService.addNote(d.x, d.y, this.cells, this.specs, this.pattern, this.track.transport);
        this.enter();
        this.merge();
      })



    enterContainer.filter((d: NoteCell) => d.header)
      .append("text")
      .attr("class", "header-text no-select")
      .attr("alignment-baseline", "center")
      .attr("x", this.specs.cellWidth / 2)
      .attr("y", this.specs.cellHeight / 2)

    this.joinData.exit().remove();
  }

  private merge(): void {

    this.mergeSelection = this.enterSelection.merge(this.joinData);
    this.mergeSelection
      .attr("transform", (d: NoteCell) => "translate(" + d.x + "," + d.y + ")")
      .classed("active", (d: NoteCell) => d.data != null)
      .classed("header", (d: NoteCell) => d.header)
      .attr("data-tick", (d: NoteCell) => d.tick)
      .attr("id", (d: NoteCell) => d.id)
      .selectAll("rect")
      .attr("width", (d: NoteCell) => d.width)
      .attr("height", (d: NoteCell) => d.height)


    this.mergeSelection.selectAll(".header-text")
      .text((d: NoteCell) => d.beat + 1 != 0 ? d.beat + 1 : "");

    /*this.updatePosition(0);*/
  }

  updatePosition(time: number): void {
    let tick = MusicMath.getTickForTime(time * 1000, this.track.transport.getBpm(), this.track.transport.getQuantization());
    this.mergeSelection
      .classed("tick-active", (d: NoteCell) => d.tick === tick && this.track.transport.isRunning());

  }
}
