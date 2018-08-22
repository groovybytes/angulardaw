import * as _ from "lodash";
import {NoteTrigger} from "../../model/daw/NoteTrigger";

export class NoteCell{

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  id:string;
  x:number;
  y:number;
  width:number;
  height:number;
  data:NoteTrigger;

}
