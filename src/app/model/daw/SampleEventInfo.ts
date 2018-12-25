export class SampleEventInfo{
  constructor(note: string) {
    this.note = note;
    this.id=this.guid();
  }


  id:string;
  note:string;
  time:number;
  offset:number;
  duration:number;
  loopLength:number;
  loopsPlayed:number=0;
  getOffset:()=>number;

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


}
