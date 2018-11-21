import {WindowPosition} from "./WindowPosition";
import {AbstractLayout} from "./AbstractLayout";


export class VerticalLayout extends AbstractLayout{



  reset(): void {


  }

  apply(): void {

    let window = this.windows.find(window=>window.order===0);
    if (window) {
      window.position.next(WindowPosition.TOP);
    }
    window = this.windows.find(window=>window.order===1);
    if (window) {
      window.position.next(WindowPosition.BOTTOM);
    }
    this.windows.forEach(window=>window.updateClass());
  }
}
