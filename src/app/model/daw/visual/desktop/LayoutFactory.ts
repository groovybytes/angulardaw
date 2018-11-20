import {Layout} from "./Layout";
import {AbstractLayout} from "./AbstractLayout";
import {VerticalLayout} from "./VerticalLayout";

export class LayoutFactory{

  static create(id:Layout):AbstractLayout{
    if (id === Layout.VERTICAL) return new VerticalLayout();
    else throw "not implemented";
  }
}
