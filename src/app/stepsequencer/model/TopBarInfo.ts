import {Lang} from "../../model/utils/Lang";
import {TransportPosition} from "../../model/daw/TransportPosition";

export class TopBarInfo{
  constructor(tick:number,text:string) {
    this.tick = tick;
    this.text = text;
  }
  tick:number;
  text:string;
  active:boolean=false;


  getId():string{
    return Lang.guid();
  }
  getCssClass(position:TransportPosition):string{
    let result = "cell";
    result+=this.tick % 2 === 0?" cell-default":" cell-alt";
    result += this.active ? " active" : "";
    result += this.tick===position.tick ? " position-focused" : "";

    return result;
  }


}
