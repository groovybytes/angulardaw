import {TriggerEvent} from "./TriggerEvent";

export class Trigger<T extends TriggerEvent>{
  constructor(
    private tester:(event:T)=>boolean,
    private resolver:()=>void){

  }

  test(event:T):boolean{
    return this.tester(event);
  }

  resolve():void{
    this.resolver();
  }
}
