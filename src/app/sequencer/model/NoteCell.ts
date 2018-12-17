
import * as _ from "lodash";
import {NoteEvent} from "../../model/mip/NoteEvent";


export class NoteCell{

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = _.uniqueId("note-cell_");
  }

  header:boolean=false;
  id:string;
  x:number;
  y:number;
  width:number;
  height:number;
  data:NoteEvent;
  beat:number;
  tick:number;
  row:number;
  column:number;
  note:string;
  time:number;
  isDragTarget:boolean=false;
  isDragging:boolean=false;

  applyAttributesFrom(cell:NoteCell):void{
    this.beat=cell.beat;
    this.tick=cell.tick;
    this.row=cell.row;
    this.header=cell.header;
    this.column=cell.column;
    this.note=cell.note;
    this.time=cell.time;
    this.x=cell.x;
    this.y=cell.y;
  }

}
