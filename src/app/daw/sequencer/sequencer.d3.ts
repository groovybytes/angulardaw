import * as d3 from "d3";
import {NoteCell} from "./model/NoteCell";
import {Pattern} from "../model/daw/Pattern";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {SequencerService} from "./sequencer.service";
import {TransportParams} from "../model/daw/TransportParams";


export class SequencerD3 {


  private container: d3.Selection<SVGElement, any, any, any>;
  private pattern:Pattern;
  private cells:Array<NoteCell>;
  private joinData:any;
  private enterSelection:d3.Selection<SVGElement, any, any, any>;

  constructor(
    private svg: SVGElement,
    private specs: SequencerD3Specs,
    private transportParams:TransportParams,
    private sequencerService: SequencerService) {
    this.container = d3.select(svg).append("g");

  }

  render(pattern: Pattern, cells: Array<NoteCell>): void {

    this.pattern=pattern;
    this.cells=cells;


    let enterSelection = this.enter();
    this.merge();


  }

  private enter():void{
    d3.select(this.svg)
      .attr("width",this.specs.columns*this.specs.cellWidth+"px")
      .attr("height",this.specs.rows*this.specs.cellWidth+"px")

    this.joinData = this.container.selectAll(".note-cell").data(this.cells);
    this.enterSelection = this.joinData.enter().append("g").attr("class", "note-cell");
    this.enterSelection.append("rect").attr("class", "fill-rect");

  }
  private merge():void{

    let mergeSelection = this.enterSelection.merge(this.joinData);
    mergeSelection
      .selectAll("rect")
      .attr("width", (d: NoteCell) => d.width)
      .attr("height", (d: NoteCell) => d.height)
      .classed("active",(d: NoteCell) => d.data != null)
      .attr("x", (d: NoteCell) => d.x)
      .attr("y", (d: NoteCell) => d.y)
      .on("dblclick", (d: NoteCell) => {
        this.sequencerService.addNote(d.x,d.y,this.cells,this.specs,this.pattern,this.transportParams);
        this.enter();
        this.merge();
      })
  }
}
