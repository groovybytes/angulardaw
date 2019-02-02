import {NoteEvent} from "../../model/mip/NoteEvent";
import {TriggerSpec} from "../../model/daw/TriggerSpec";
import {Lang} from "../../model/utils/Lang";


export class NoteCell{

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = Lang.guid();
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
  trigger:TriggerSpec;
  time:number;
  isDragTarget:boolean=false;
  isDragging:boolean=false;

  applyAttributesFrom(cell:NoteCell):void{
    this.beat=cell.beat;
    this.tick=cell.tick;
    this.row=cell.row;
    this.header=cell.header;
    this.column=cell.column;
    this.trigger=cell.trigger;
    this.time=cell.time;
    this.x=cell.x;
    this.y=cell.y;
  }

}
