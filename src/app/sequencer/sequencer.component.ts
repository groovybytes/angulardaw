import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PatternViewModel} from "../model/viewmodel/PatternViewModel";
import {SequencerService} from "./sequencer.service";
import {MusicMath} from "../model/utils/MusicMath";
import {TransportService} from "../shared/services/transport.service";
import {ContentCell} from "../ui/flexytable/model/ContentCell";
import {HeaderCell} from "../ui/flexytable/model/HeaderCell";
import {FlexyGridEntry} from "../ui/flexytable/model/FlexyGridEntry";
import {NoteTriggerViewModel} from "../model/viewmodel/NoteTriggerViewModel";
import {TheoryService} from "../shared/services/theory.service";
import {NoteLength} from "../model/mip/NoteLength";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnChanges {

  @Input() pattern: PatternViewModel;

  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 100;


  highlightColumn: number = -1;
  noteCells: Array<Array<ContentCell>> = [];
  headerCells: Array<HeaderCell<any>> = [];
  entries: Array<FlexyGridEntry<NoteTriggerViewModel>> = [];
  allNotes: Array<string>;

  private quantization: NoteLength;

  constructor(private element: ElementRef,
              private theoryService: TheoryService,
              private sequencerService: SequencerService,
              private transportService: TransportService) {


    this.allNotes = theoryService.getAllIds();
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.transportService.params.bpm.getValue(), this.transportService.params.quantization.getValue()) * column;
  }

  ngOnInit() {
    this.transportService.params.quantization.subscribe(nextValue => {
      if (this.pattern&&this.quantization !== nextValue) {
        this.quantization = nextValue;
        this.transportService.params.tickEnd = this.pattern.length *
          MusicMath.getBeatTicks(this.transportService.params.quantization.getValue());
        this.updateCells();
      }
    });

    this.transportService.time.subscribe(time => {
      this.highlightColumn = MusicMath.getTickForTime(time * 1000, this.transportService.params.bpm.getValue(), this.transportService.params.quantization.getValue());
    });

    this.transportService.transportEnd.subscribe(() => this.highlightColumn = -1);
  }


  onNoteCellClicked(cell: ContentCell): void {
    //this.sequencerService.onNoteCellClicked(cell,this.pattern);

  }

  onGridEntryAdded(entry: FlexyGridEntry<NoteTriggerViewModel>): void {
    this.sequencerService.addEvent(entry, this.cellWidth, this.cellHeight, this.pattern, this.transportService.params);

  }

  onGridEntryUpdated(entry: FlexyGridEntry<NoteTriggerViewModel>): void {
    this.sequencerService.updateEvent(entry, this.cellWidth, this.cellHeight, this.pattern, this.transportService.params);
  }

  onGridEntryRemoved(entry: FlexyGridEntry<NoteTriggerViewModel>): void {
    this.sequencerService.removeEvent(entry, this.pattern);
  }

  /*  onEventCellClicked(event: any, cell: EventCell): void {
      //this.sequencerService.onEventCellClicked(cell, this.eventCells, this.pattern);

    }*/


  ngOnChanges(changes: SimpleChanges): void {

    if (changes.pattern && changes.pattern.currentValue) {
      this.updateCells();
    }
  }

  private updateCells(): void {
    this.quantization = this.transportService.params.quantization.getValue();
    this.noteCells.length = 0;
    this.headerCells.length = 0;
    this.noteCells = this.sequencerService.createNoteCells(this.transportService.params, this.pattern);
    this.headerCells = this.sequencerService.createHeaderCells(this.transportService.params, this.pattern);
    this.entries = this.sequencerService.createEntries(this.pattern, this.cellWidth, this.cellHeight, this.transportService.params);
  }


}
