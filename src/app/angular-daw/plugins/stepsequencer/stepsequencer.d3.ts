import {ElementRef, EventEmitter} from "@angular/core";
import {CellInfo} from "./model/CellInfo";
import * as d3 from "d3";

export class StepsequencerD3 {

  public onContextMenu: (cell: CellInfo) => void;
  public onMouseEnter: (cell: CellInfo) => void;
  public onMouseLeave: (cell: CellInfo) => void;
  public click:EventEmitter<CellInfo>=new EventEmitter<CellInfo>();
  public onDblClick: (cell: CellInfo) => void;
  private mergeSelection;
  cellSize: number = 20;
  //private container: d3.Selection<SVGElement, {}, HTMLElement, any>;

  constructor(private svgElement: HTMLElement) {

  }

  render(model: Array<CellInfo>): void {
    let columns = model.filter(d=>d.column===0).length;
    let rows = Math.floor(model.length/columns);
    let svgElement=d3.select(this.svgElement);
    let container = d3.select(this.svgElement).append("g").attr("class", "step-sequencer");
    let cellHeight=50,cellWidth=50,cellPadding=5;

    let bandWidthX=cellWidth+cellPadding*2;
    let bandWidthY=cellHeight+cellPadding*2;
    let width = bandWidthX*columns;
    let height = bandWidthY*rows;

    svgElement
      .attr("width", width+ "px")
      .attr("height", height + "px");

    container.attr("transform", "translate(100,100)");

    let join = container.selectAll(".cell-container").data(model);

    join.exit().remove();

    let enterSelection = join.enter().append("g").attr("class", d=>d.getCssClass())
    enterSelection
      .append("rect")
      .on('contextmenu', (d: CellInfo) => this.onContextMenu(d))
      .on("mouseover", (cell) => this.onMouseEnter(cell))
      .on("mouseout", (cell) => this.onMouseLeave(cell))
      .on("click", (cell) => this.click.emit(cell))
      .on("dblClick", (cell) => this.onDblClick(cell));


    this.mergeSelection = enterSelection.merge(join);
    this.mergeSelection.attr("data-id", (d: CellInfo,i) => i)
      .attr("data-column", (d, i) => i % rows)
      .attr("data-row", (d, i) => Math.floor(i / rows))
      .classed("empty", (d: CellInfo) => true)
      .selectAll("rect")
      .attr("transform", (d: CellInfo) => "translate(" + ((d.column) * bandWidthX) + "," + ((d.row) * bandWidthY) + ")")
      .attr("width", cellWidth+"px")
      .attr("height", cellHeight+"px")
      .attr("class", "cell-visual")


  }

  updateState(): void {
    this.mergeSelection.attr("class", (d: CellInfo) => d.getCssClass());
  }

  highlightColumn(column:number):void{
    this.mergeSelection.classed("position-focused",false);
    this.mergeSelection.filter((d:CellInfo)=>d.column===column).classed("position-focused",true)
  };


}


