import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {MusicMath} from "../model/utils/MusicMath";
import {TheoryService} from "../shared/services/theory.service";
import "jqueryui";
import {Pattern} from "../model/daw/Pattern";
import {NoteCell} from "./model/NoteCell";
import {TracksService} from "../shared/services/tracks.service";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {WindowSpecs} from "../model/daw/visual/WindowSpecs";
import {Project} from "../model/daw/Project";
import {SequencerService2} from "./sequencer2.service";
import {DragHandler} from "./DragHandler";
import {Subscription} from "rxjs/internal/Subscription";
import {NoteLength} from "../model/mip/NoteLength";
import {ProjectsService} from "../shared/services/projects.service";


@Component({
  selector: 'sequencer2',
  templateUrl: './sequencer2.component.html',
  styleUrls: ['./sequencer2.component.scss']
})
export class Sequencer2Component implements OnInit, OnChanges {

  @Input() project: Project;
  @Input() pattern: Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 100;
  @Input() window: WindowSpecs;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();


  @ViewChild("card") card: ElementRef;
  cells: Array<NoteCell> = [];
  allNotes: Array<string>;
  tick: number;
  dragHandler: DragHandler = new DragHandler();

  private isResizing: boolean = false;
  private specs: SequencerD3Specs = new SequencerD3Specs();
  private subscriptions: Array<Subscription> = [];

  constructor(private element: ElementRef,
              private theoryService: TheoryService,
              private tracksService: TracksService,
              private projectsService:ProjectsService,
              private sequencerService: SequencerService2) {


    this.allNotes = theoryService.getAllIds();
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.pattern.transportContext.settings.global.bpm,
      this.pattern.quantization.getValue()) * column;
  }

  ngOnInit() {
    this.sequencerService.initializeWindow(this.card.nativeElement, this.window);
    this.sequencerService.updateWindow(this.card.nativeElement, this.window);

  }

  toggleClip(): void {
    this.projectsService.toggleChannel(this.project,this.pattern.id,this.pattern.transportContext.settings);

  }

  clipIsRunning(): boolean {
    return this.project.isRunning([this.pattern.id]);
  }

  onCellClicked(cell: NoteCell): void {
    if (!this.isResizing) {
      if (cell.column >= 0 && cell.row >= 0) {
        if (cell.data) this.sequencerService.removeEvent(cell, this.pattern);
        else this.sequencerService.addNote(cell.x, cell.y, this.cells, this.specs, this.pattern);
      }
    }
  }

  changeQuantization(value:NoteLength):void{
    this.pattern.quantization.next(value);
  }

  getHeaderCells(): Array<NoteCell> {
    return this.cells.filter(cell => cell.row === -1);
  }

  resizeStart(): void {
    this.isResizing = true;

  }

  resizeEnd(elementTarget: EventTarget): void {

    setTimeout(() => {
      this.isResizing = false;
      this.sequencerService.onResized(elementTarget, this.cells, this.pattern, this.specs);
    }, 10);
  }

  onDrop(event: DragEvent): void {
    let cells = this.sequencerService.onDrop(event, this.cells);
    this.sequencerService.moveCell(cells.source, cells.target);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      this.subscriptions.forEach(subscr => subscr.unsubscribe());
      this.subscriptions.push(this.pattern.time.subscribe(time => {
        this.tick = MusicMath.getTickForTime(time * 1000, this.pattern.transportContext.settings.global.bpm, this.pattern.quantization.getValue());
      }));

      this.subscriptions.push(this.pattern.quantization.subscribe(nextValue => {

        if (nextValue) this.updateCells();
      }));
      this.updateCells();

    }
  }

  private updateCells(): void {
    this.cells.length = 0;
    this.cells = this.sequencerService.createCells(this.pattern, this.specs);
  }


}
