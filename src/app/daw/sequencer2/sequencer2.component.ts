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
import {Subscription} from "rxjs/internal/Subscription";
import {NoteLength} from "../model/mip/NoteLength";
import {ProjectsService} from "../shared/services/projects.service";
import {SimpleSliderModel} from "../model/daw/visual/SimpleSliderModel";
import {PatternsService} from "../shared/services/patterns.service";
import {DragHandler} from "../model/daw/visual/DragHandler";
import {SequencerDragHandler} from "./SequencerDragHandler";


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
  readonly cells: Array<NoteCell> = [];
  allNotes: Array<string>;
  tick: number;
  dragHandler: DragHandler = new SequencerDragHandler(
    this.cells,
    () => this.pattern && this.pattern.quantizationEnabled.getValue(),
    this.sequencerService);

  lengthSlider: SimpleSliderModel = {
    value: 8,
    options: {
      floor: 1,
      ceil: 16,
      vertical: false,
      showSelectionBar: true
    }
  };
  private isResizing: boolean = false;
  private isDragging: boolean = false;
  private specs: SequencerD3Specs = new SequencerD3Specs();
  private subscriptions: Array<Subscription> = [];

  constructor(private element: ElementRef,
              private theoryService: TheoryService,
              private tracksService: TracksService,
              private projectsService: ProjectsService,
              private patternsService: PatternsService,
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
    this.patternsService.togglePattern(this.pattern.id, this.project);

  }


  changePatternLength(value: SimpleSliderModel): void {
    this.pattern.setLengthInBars(value.value);
    this.updateCells();
  }

  clipIsRunning(): boolean {
    return this.pattern && this.project.isRunningWithChannel(this.pattern.id);
  }

  onCellClicked(cell: NoteCell): void {
    if (!this.isResizing && !this.isDragging) {
      if (cell.column >= 0 && cell.row >= 0) {
        if (cell.data) this.sequencerService.removeEvent(this.cells,cell, this.pattern);
        else this.sequencerService.addNote(cell.x, cell.y, this.cells, this.specs, this.pattern);
      }
    }
  }

  changeQuantization(value: NoteLength): void {
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

  dragStart(): void {
    this.isDragging = true;

  }

  dragEnd(cell:NoteCell): void {

    setTimeout(() => {
      this.isDragging = false;
      this.sequencerService.updateEvent(cell,this.specs,this.pattern);
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      if (this.pattern) {
        this.subscriptions.forEach(subscr => subscr.unsubscribe());
        this.subscriptions.push(this.pattern.time.subscribe(time => {
          this.tick = MusicMath.getTickForTime(time * 1000, this.pattern.transportContext.settings.global.bpm, this.pattern.quantization.getValue());
        }));
        this.subscriptions.push(this.pattern.quantization.subscribe(nextValue => {

          if (nextValue) this.updateCells();
        }));
        /*  this.subscriptions.push(this.pattern.quantizationEnabled.subscribe(nextValue => {
              this.dragHandler= new SequencerDragHandler();//  nextValue?new SequencerDragHandler():new RawDragHandler(this.cells);
          }));*/
        this.updateCells();
      }
    }
  }

  private updateCells(): void {
    this.cells.length = 0;
    let newCells = this.sequencerService.createCells(this.pattern, this.specs);
    newCells.forEach(cell=>this.cells.push(cell));
  }


}
