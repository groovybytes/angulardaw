import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Pattern} from "../model/daw/Pattern";
import {SequencerService} from "./sequencer.service";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportService} from "../shared/services/transport.service";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../ui/flexytable/model/HeaderCell";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {NoteTriggerDto} from "../shared/api/NoteTriggerDto";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnChanges {

  @Input() pattern:Pattern;

  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 100;

  noteCells: Array<Array<ContentCell> >=[];
  headerCells: Array<HeaderCell>=[];
 entries: Array<FlexyGridEntry<NoteTriggerDto>> = [];


  constructor(private element: ElementRef, private sequencerService: SequencerService, private transportService: TransportService) {
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.transportService.params.bpm, this.transportService.params.quantization) * column;
  }

  ngOnInit() {

    console.log("init");
    /*  this.noteCells = this.sequencerService.createNoteCells(this.transportService.params,this.getPattern());
      this.headerCells = this.sequencerService.createHeaderCells(this.transportService.params,this.getPattern());*/

  }


  onNoteCellClicked(cell:ContentCell): void {
    //this.sequencerService.onNoteCellClicked(cell,this.pattern);

  }

  onGridEntryAdded(entry:FlexyGridEntry<NoteTriggerDto>):void{
    this.sequencerService.addEvent(entry,this.cellWidth,this.cellHeight,this.pattern,this.transportService.params);

  }
  onGridEntryRemoved(entry:FlexyGridEntry<NoteTriggerDto>):void{
    this.sequencerService.removeEvent(entry,this.pattern);
  }

/*  onEventCellClicked(event: any, cell: EventCell): void {
    //this.sequencerService.onEventCellClicked(cell, this.eventCells, this.pattern);

  }*/


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern && changes.pattern.currentValue){
      this.noteCells.length=0;
      this.headerCells.length=0;
      this.noteCells = this.sequencerService.createNoteCells(this.transportService.params,this.pattern);
      this.headerCells = this.sequencerService.createHeaderCells(this.transportService.params,this.pattern);
      this.entries = this.sequencerService.createEntries(this.pattern,this.cellWidth,this.cellHeight,this.transportService.params);
    }
  }


}
