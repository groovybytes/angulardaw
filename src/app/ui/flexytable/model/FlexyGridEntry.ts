export class FlexyGridEntry<T>{
  constructor(data: T, left: number, top: number) {
    this.data = data;
    this.left = left;
    this.top = top;
  }
  data:T;
  left:number;
  top:number;
  isOffGrid:boolean=false;


}
