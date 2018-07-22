import {EventEmitter} from "@angular/core";
import * as d3 from "d3";

export class CellEvents<T> {
  public contextMenu: EventEmitter<T> = new EventEmitter<T>();
  public mouseLeave: EventEmitter<T> = new EventEmitter<T>();
  public mouseEnter: EventEmitter<T> = new EventEmitter<T>();
  public click: EventEmitter<T> = new EventEmitter<T>();
  public dbClick: EventEmitter<T> = new EventEmitter<T>();

  apply(selection): void {
    selection.on('contextmenu', (cell: T) => this.contextMenu.emit(cell))
      .on("mouseover", (cell: T) => this.mouseEnter.emit(cell))
      .on("mouseout", (cell: T) => this.mouseLeave.emit(cell))
      .on("click", (cell: T) => this.click.emit(cell))
      .on("dblClick", (cell: T) => this.dbClick.emit(cell));
  }
}
