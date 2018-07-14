export class DrumKitSpec{
  id:string;
  pieces:Array<{
    category:string;
    index:number;
    triggers:{
      hit:{
        sample:string;
        note:string;
      }
    }
  }>
}
