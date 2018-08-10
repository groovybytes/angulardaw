import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {Pattern} from "../model/daw/Pattern";
import {NoteCell} from "./model/NoteCell";
import {SequencerService} from "./sequencer.service";
import {EventCell} from "./model/EventCell";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportService} from "../shared/services/transport.service";
import {NoteInfo} from "../model/utils/NoteInfo";
import {GridCellDto} from "../shared/api/GridCellDto";
import {ProjectDto} from "../shared/api/ProjectDto";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit {

  @Input() project: ProjectDto;

  @Input() cellWidth: number = 20;
  @Input() cellHeight: number = 20;

  /* noteCells: Array<Array<NoteCell>>;
   columns: Array<ColumnInfo>;
   eventCells: Array<EventCell> = [];*/

  private allNotes: Array<string>;

  constructor(private element: ElementRef, private sequencerService: SequencerService, private transportService: TransportService) {
    NoteInfo.load();
    this.allNotes = NoteInfo.getAllIds();
  }

  getTime(column:number):number{
    return MusicMath.getTickTime(this.transportService.params.bpm,this.transportService.params.quantization)*column;
  }

  getPattern(): Pattern {
    return this.project.patterns.find(p=>p.isBeingEdited);
  }

  getNotes():Array<string>{
    return this.getPattern().notes.length === 0 ? this.allNotes : this.getPattern().notes;
  }

  ngOnInit() {

    /*this.noteCells = this.sequencerService.createNoteCells(this.transportParams,this.pattern);
    this.columns = this.sequencerService.createColumnInfos(this.transportParams,this.pattern);*/
  }


  getColumns(): Array<any> {
    let columns = MusicMath.getBeatTicks(this.transportService.params.quantization);
    return Array(this.getPattern().length * columns).fill(0);
  }

  onNoteCellClicked(event: any, column:number,row:number): void {
    console.log(column);
    this.sequencerService.onNoteCellClicked(event,this.getNotes(),row,column,this.getPattern(),this.transportService.params,this.element);

  }

  onEventCellClicked(event: any, cell: EventCell): void {
    //this.sequencerService.onEventCellClicked(cell, this.eventCells, this.pattern);

  }

  onEventCellPositionChanged(cell: EventCell): void {
    // this.sequencerService.onEventCellPositionChanged(cell, this.noteCells, this.pattern,this.transportParams);

  }


}
