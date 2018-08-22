import * as _ from "lodash";

export class HeaderCell {
  id:string;

  constructor() {
    this.id =  this.id=_.uniqueId("header-cell-");
  }

  column:number;
  beat:number;
}
