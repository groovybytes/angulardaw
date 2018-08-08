import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Pattern} from "../model/daw/Pattern";
import {NoteCell} from "./model/NoteCell";
import {SequencerService} from "./sequencer.service";
import {EventCell} from "./model/EventCell";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportService} from "../shared/services/transport.service";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {

  @Input() pattern: Pattern;

 /* noteCells: Array<Array<NoteCell>>;
  columns: Array<ColumnInfo>;
  eventCells: Array<EventCell> = [];*/
  cellDimensionIndex: number = 0;
  cellDimensions = [
    {width: 100, height: 50},
    {width: 200, height: 100}
  ];

  constructor(private element: ElementRef, private sequencerService: SequencerService,private transportService:TransportService) {
  }

  ngOnInit() {
    /*this.noteCells = this.sequencerService.createNoteCells(this.transportParams,this.pattern);
    this.columns = this.sequencerService.createColumnInfos(this.transportParams,this.pattern);*/
  }

  getRows(): Array<any> {
    return Array(this.pattern.notes.length).fill(0);
  }

  getColumns(): Array<any> {
    let columns = MusicMath.getBeatTicks(this.transportService.params.quantization);
    return Array(this.pattern.length*columns).fill(0);
  }

  onNoteCellClicked(event: any, cell: NoteCell): void {

    //this.sequencerService.onNoteCellClicked(event, cell, this.eventCells, this.pattern, this.element);

  }

  onEventCellClicked(event: any, cell: EventCell): void {
    //this.sequencerService.onEventCellClicked(cell, this.eventCells, this.pattern);

  }

  onEventCellPositionChanged(cell: EventCell): void {
   // this.sequencerService.onEventCellPositionChanged(cell, this.noteCells, this.pattern,this.transportParams);

  }


}
