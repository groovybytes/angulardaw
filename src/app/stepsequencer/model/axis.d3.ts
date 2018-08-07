/*
export abstract class Axis {
  protected scaleBandY;
  protected scaleBandX;
  protected ticksMerge;

  nodeFactor: number = 0.3;// node=the  rectangle below text
  tickFactor: number = 3;// tick=the container for an entry
  textGap: number = 50;// the gap between the 2 texts

  constructor(protected container: any) {

  }

  render(data: Array<MatrixEntry>, scaleBandX, scaleBandY): void {

    let maxTextLength = 15;

    this.scaleBandX = scaleBandX;
    this.scaleBandY = scaleBandY;

    let join = this.container.selectAll(".tick").data(data, d => d.getId());

    let ticksEnter = join.enter().append("g").attr("class", "tick");

    ticksEnter.append("rect").attr("class", "fill-rect")
      .on("mouseenter", (d, i) => this.matrix.onMouseEnter(d))
      .on("mouseout", (d, i) => this.matrix.onMouseLeave(d))
      .on('contextmenu', (d, i) => this.matrix.onContextMenu(d))
      .on("click", (d, i) => this.matrix.onClick(d))
      .on("dblClick", (d, i) => this.matrix.onDblClick(d));

    ticksEnter.append("rect").attr("class", "node");
    ticksEnter.append("text").attr("class", "unselectable main-text").attr("alignment-baseline", "middle");
    ticksEnter.append("text").attr("class", "unselectable header-text").attr("alignment-baseline", "middle");
    ticksEnter.append("line").attr("class", "grid-line");

    this.ticksMerge = ticksEnter.merge(join);

    this.ticksMerge
      .attr("class", (d: MatrixEntry) => "tick " + Utils.stringifyStrings(d.getCssClasses()))
      .attr("data-id", (d: MatrixEntry) => d.getId())
      .attr("data-column", (d, i) => this.getColumn(d, i))
      .attr("data-row", (d, i) => this.getRow(d, i))
      .attr("tickHeight", this.getFillRectHeight() + "px")
      .attr("tickWidth", this.getFillRectWidth() + "px")
      .attr("transform", (d, i) => this.getTickTransform(d));

    this.ticksMerge.selectAll(".main-text")
      .attr("font-size", "10px")
      .attr("x", this.getTextX())
      .attr("y", this.getTextY())
      .attr("transform", () => this.getTextTransform())
      .attr("transform-origin", this.getTextTransformOrigin())
      .text(d => d.getText().substr(0, maxTextLength));

    this.ticksMerge.selectAll(".header-text")
      .attr("font-size", "10px")
      .attr("x", this.getTextX())
      .attr("y", this.getTextY())
      .attr("dx", this.getHeaderTextOffset())
      .attr("transform", () => this.getTextTransform())
      .attr("transform-origin", this.getTextTransformOrigin())
      .text(d => this.getHeaderText(d).substr(0, maxTextLength))

    this.ticksMerge.selectAll("line")
      .attr("x1", this.getLineCoordinates().x1)
      .attr("x2", this.getLineCoordinates().x2)
      .attr("y1", this.getLineCoordinates().y1)
      .attr("y2", this.getLineCoordinates().y2)
      .attr("transform", this.getLineTransform())

    this.ticksMerge.selectAll(".node")
      .attr("y", this.getNodeY() + "px")
      .attr("x", this.getNodeX() + "px")
      .attr("tickWidth", this.getNodeWidth() + "px")
      .attr("tickHeight", this.getNodeHeight() + "px");

    this.ticksMerge.selectAll(".fill-rect")
      .attr("tickHeight", this.getFillRectHeight() + "px")
      .attr("tickWidth", this.getFillRectWidth() + "px");

    join.exit().remove();

  }

  updateState(): void {
    this.ticksMerge
      .attr("class", (d: MatrixEntry) => "tick " + Utils.stringifyStrings(d.getCssClasses()))
  }

  //returns the tickWidth of a tick
  abstract getWidth(): number;

  //returns the tickHeight of a tick
  abstract getHeight(): number;

  abstract getTextX(): number;

  abstract getTextY(): number;

  abstract getTextTransform(): string;

  abstract getTextTransformOrigin(): string;

  abstract getHeaderTextOffset(): number;

  abstract getLineCoordinates(): any;

  abstract getLineTransform(): string;

  abstract getNodeWidth(): number;

  abstract getNodeHeight(): number;

  abstract getNodeX(): number;

  abstract getNodeY(): number;

  abstract getHeaderText(d: MatrixEntry): string;

  abstract getFillRectWidth(): number;

  abstract getFillRectHeight(): number;


  abstract getColumn(d: MatrixEntry, index: number): number;

  abstract getRow(d: MatrixEntry, index: number): number;

  abstract getTickTransform(d: MatrixEntry): string;
}

export class XAxis extends Axis {

  constructor(protected d3, protected matrix: LoomeoMatrix, protected container: any) {
    super(d3, matrix, container);
    this.container.attr("text-anchor", "middle");
  }

  getHeight(): number {
    return this.scaleBandY.bandwidth() * this.tickFactor;
  }

  getWidth(): number {
    return this.scaleBandX.bandwidth();
  }

  getTextX(): number {
    return this.getWidth() / 2;
  }

  getTextY(): number {
    return this.getHeight() - this.getNodeHeight() / 2;
  }

  getTextTransform(): string {

    //41/123
    return "rotate(-90 0 0)";// translate(5,60)";//"-90";//"rotate(270 41 123)";
  }

  getTextTransformOrigin(): string {
    return "-45px 45px";//"0 " + (this.getHeight() / 2+this.getNodeHeight()/2);
  }

  getHeaderTextOffset(): number {
    return this.textGap;
  }

  getLineCoordinates(): any {
    return ({
      x1: this.getWidth() / 2,
      x2: this.getWidth() / 2,
      y1: this.getHeight(),
      y2: this.scaleBandY.range()[1] + this.getHeight()
    });

  }

  getLineTransform(): string {
    return "";
  }

  getNodeWidth(): number {
    return this.getWidth();
  }

  getNodeHeight(): number {
    return this.getHeight() * this.nodeFactor;
  }

  getNodeX(): number {
    return 0;
  }

  getNodeY(): number {
    return this.getHeight() - this.getNodeHeight();
  }

  getHeaderText(d: MatrixEntry): string {

    return d.getHeaderText(true);
  }

  getFillRectWidth(): number {
    return this.getWidth();
  }

  getFillRectHeight(): number {
    return this.getHeight();
  }


  getColumn(d: MatrixEntry): number {
    return d.column;
  }

  getRow(): number {
    return -1;
  }

  getTickTransform(d: MatrixEntry): string {
    return "translate(" + ((d.column) * this.getWidth() + this.getWidth() / 2) + " " + (-this.getHeight()) + ")";
  }

}

export class YAxis extends Axis {

  constructor(protected d3, protected matrix: LoomeoMatrix, protected container: any) {
    super(d3, matrix, container);
    this.container.attr("text-anchor", "end");
  }

  getHeight(): number {
    return this.scaleBandY.bandwidth();
  }

  getWidth(): number {
    return this.scaleBandX.bandwidth() * this.tickFactor;
  }


  getColumn(d: de.teseon.loomeo.graphbase.d3.matrixV2.MatrixEntry, index: number): number {
    return -1;
  }

  getFillRectHeight(): number {
    return this.getHeight();
  }

  getFillRectWidth(): number {
    return this.getWidth();
  }


  getHeaderText(d: de.teseon.loomeo.graphbase.d3.matrixV2.MatrixEntry): string {
    return d.getHeaderText(false);
  }

  getHeaderTextOffset(): number {
    return -this.textGap;
  }

  getLineCoordinates(): any {
    return ({
      x1: this.getWidth(),
      x2: this.scaleBandX.range()[1] + this.getWidth(),
      y1: this.getHeight() / 2,
      y2: this.getHeight() / 2
    });
  }

  getLineTransform(): string {
    return "";
  }

  getNodeHeight(): number {
    return this.getHeight();
  }

  getNodeWidth(): number {
    return this.getWidth() * this.nodeFactor;
  }

  getNodeX(): number {
    return this.getWidth() - this.getNodeWidth();
  }

  getNodeY(): number {
    return 0;
  }

  getRow(d: de.teseon.loomeo.graphbase.d3.matrixV2.MatrixEntry, index: number): number {
    return d.row;
  }

  getTextTransform(): string {
    return "";
  }

  getTextTransformOrigin(): string {
    return "";
  }

  getTextX(): number {
    return this.getWidth() - this.getNodeHeight();
  }

  getTextY(): number {
    return this.getHeight() / 2;
  }


  getTickTransform(d: MatrixEntry): string {
    return "translate(" + (-this.getWidth()) + " " + ((d.row) * this.getHeight() + this.getHeight() / 2) + ")";
  }


}

*/
