import {BehaviorSubject} from "rxjs";
import {PadInfo} from "./PadInfo";

export class Pad {
  info:PadInfo;
  cssClass: string;
  state: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(info:PadInfo) {
   this.info=info;

    this.state.subscribe(() => this.updateCssClass());
    //todo: destroy
  }

  private updateCssClass(): void {
    let clazz = "pad";
    if (this.state.getValue() === 1) clazz += " pushed";
    if (this.state.getValue() === 2) clazz += " fixed";
    this.cssClass = clazz;
  }


}

