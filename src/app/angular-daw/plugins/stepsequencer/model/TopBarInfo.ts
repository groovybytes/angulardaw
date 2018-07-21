import {Lang} from "../../../model/utils/Lang";

export class TopBarInfo{
  constructor(tick:number,text:string) {
    this.tick = tick;
    this.text = text;
  }
  tick:number;
  text:string;

  getId():string{
    return Lang.guid();
  }
  getCssClass():string{
    let result = "cell";
    result+=this.tick % 2 === 0?" cell-default":" cell-alt";
    return result;
  }


}
