export class PadInfo{
  note:string;
  row:number;
  column:number;
  keyBinding:string;

  constructor(note: string, row: number, column: number, keyBinding: string) {
    this.note = note;
    this.row = row;
    this.column = column;
    this.keyBinding = keyBinding;
  }


}
