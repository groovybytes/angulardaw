export class FlexyGridEntry<T>{
  constructor(data: T, left: number, top: number,column:number) {
    this.data = data;
    this.left = left;
    this.top = top;
    this.column=column;
  }
  data:T;
  left:number;
  top:number;
  column:number;
  offGrid:boolean=false;



}
