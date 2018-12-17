import {BehaviorSubject} from "rxjs";

export class PadInfo {
  note: string;
  row: number;
  column: number;
  keyBinding: string;
  cssClass: string;
  state: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(note: string, row: number, column: number, keyBinding: string) {
    this.note = note;
    this.row = row;
    this.column = column;
    this.keyBinding = keyBinding;

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
