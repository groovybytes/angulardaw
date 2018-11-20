import {WindowPosition} from "./WindowPosition";
import {Layout} from "./Layout";
import {AbstractLayout} from "./AbstractLayout";


export class VerticalLayout extends AbstractLayout{


  getId(): Layout {
    return Layout.VERTICAL;
  }

  reset(): void {

    let window = this.windows.find(window=>window.order===0);
    if (window) {
      window.position.next(WindowPosition.TOP);
    }
    window = this.windows.find(window=>window.order===1);
    if (window) {
      window.position.next(WindowPosition.BOTTOM);
    }

  }

  apply(): void {
  }
}
