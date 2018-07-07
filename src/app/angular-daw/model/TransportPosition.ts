export class TransportPosition{
  beat:number=0;
  bar:number=0;
  time:number=0;

  reset():void{
    this.beat=0;
    this.bar=0;
    this.time=0;
  }
}
