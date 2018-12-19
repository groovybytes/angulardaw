import {ScaleId} from "./ScaleId";


export class Scale {
  constructor(id: ScaleId, formula: Array<number>, label: string) {
    this.id = id;
    this.formula = formula;
    this.label = label;
  }

  id: ScaleId;
  formula:Array<number>;
  label:string;




}
