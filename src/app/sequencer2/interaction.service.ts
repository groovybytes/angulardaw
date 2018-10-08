import {NoteCell} from "./model/NoteCell";
import {SequencerService2} from "./sequencer2.service";
import {Injectable} from "@angular/core";

@Injectable()
export class InterActionService {

  constructor(private sequencerService: SequencerService2) {

  }

  onCellClicked(cell: NoteCell): void {

  }

  mouseUp(cell: NoteCell): void {
    console.log(cell);
  }
}
