import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Pattern} from "../model/daw/Pattern";
import {Cell} from "./model/Cell";
import {SequencerService} from "./sequencer.service";
import {EventCell} from "./model/EventCell";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportService} from "../shared/services/transport.service";
import {HeaderCell} from "./model/HeaderCell";
import {NoteTriggerDto} from "../shared/api/NoteTriggerDto";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnChanges {

  @Input() pattern:Pattern;

  @Input() cellWidth: number = 20;
  @Input() cellHeight: number = 20;
  droppedData: string = '';
  gridSize = 100;

  grids = [0, 100, 200, 300, 400];

  noteCells: Array<Array<Cell> >=[];
  headerCells: Array<HeaderCell>=[];
  /* columns: Array<ColumnInfo>;*/
  /* eventCells: Array<EventCell> = [];*/

  x(cell:Cell):number{
    return 100;
  }
  y(cell:Cell):number{
    return 100;
  }

  constructor(private element: ElementRef, private sequencerService: SequencerService, private transportService: TransportService) {
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.transportService.params.bpm, this.transportService.params.quantization) * column;
  }

  onDrop(event): void {
    //this.droppedData = dropData;
    console.log(event);
    setTimeout(() => {
      this.droppedData = '';
    }, 2000);
  }
  ngOnInit() {

    console.log("init");
    /*  this.noteCells = this.sequencerService.createNoteCells(this.transportService.params,this.getPattern());
      this.headerCells = this.sequencerService.createHeaderCells(this.transportService.params,this.getPattern());*/

  }


  onNoteCellClicked(cell:Cell): void {
    this.sequencerService.onNoteCellClicked(cell,this.pattern);

  }

  onEventCellClicked(event: any, cell: EventCell): void {
    //this.sequencerService.onEventCellClicked(cell, this.eventCells, this.pattern);

  }

  onEventCellPositionChanged(cell: EventCell): void {
    // this.sequencerService.onEventCellPositionChanged(cell, this.noteCells, this.pattern,this.transportParams);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern && changes.pattern.currentValue){

      this.noteCells.length=0;
      this.headerCells.length=0;
      this.noteCells = this.sequencerService.createNoteCells(this.transportService.params,this.pattern);
      this.headerCells = this.sequencerService.createHeaderCells(this.transportService.params,this.pattern)
    }
  }


}
