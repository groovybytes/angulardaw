import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {MusicMath} from "../shared/model//utils/MusicMath";
import "jqueryui";
import {Pattern} from "../shared/model//daw/Pattern";
import {NoteCell} from "./model/NoteCell";
import {TracksService} from "../shared/services/tracks.service";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {Project} from "../shared/model//daw/Project";
import {SequencerService2} from "./sequencer2.service";
import {Subscription} from "rxjs/internal/Subscription";
import {NoteLength} from "../shared/model//mip/NoteLength";
import {ProjectsService} from "../shared/services/projects.service";
import {SimpleSliderModel} from "../shared/model//daw/visual/SimpleSliderModel";
import {PatternsService} from "../shared/services/patterns.service";
import {DragHandler} from "../shared/model//daw/visual/DragHandler";
import {SequencerDragHandler} from "./SequencerDragHandler";
import {Cell} from "../shared/model//daw/matrix/Cell";
import {Notes} from "../shared/model/daw/Notes";


@Component({
  selector: 'sequencer2',
  templateUrl: './sequencer2.component.html',
  styleUrls: ['./sequencer2.component.scss']
})
export class Sequencer2Component implements OnInit, OnChanges {

  @Input() project: Project;
  @Input() pattern: Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 50;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

/*  @ViewChild("card") card: ElementRef;*/
  readonly tableCells: Array<NoteCell> = [];
  readonly eventCells: Array<NoteCell> = [];
  allNotes: Array<string>;
  tick: number;
  dragHandler: DragHandler;

  lengthSlider: SimpleSliderModel = {
    value: 8,
    options: {
      floor: 1,
      ceil: 16,
      vertical: true,
      showSelectionBar: true
    }
  };
  isResizing: boolean = false;
  private isDragging: boolean = false;
  private specs: SequencerD3Specs = new SequencerD3Specs();
  private subscriptions: Array<Subscription> = [];

  constructor(private element: ElementRef,
              private cd: ChangeDetectorRef,
              @Inject("Notes") private notes: Notes,
              private tracksService: TracksService,
              private projectsService: ProjectsService,
              private patternsService: PatternsService,
              private sequencerService: SequencerService2) {


    this.dragHandler = new SequencerDragHandler(
      this.tableCells,
      this.eventCells,
      cd,
      this.sequencerService);
    this.allNotes = notes.getAllIds();
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.pattern.transportContext.settings.global.bpm,
      this.pattern.quantization.getValue()) * column;
  }

  ngOnInit() {
   /* this.sequencerService.initializeWindow(this.card.nativeElement, this.window);
    this.sequencerService.updateWindow(this.card.nativeElement, this.window);*/

  }

  toggleClip(): void {
    this.patternsService.togglePattern(this.pattern.id, this.project);

  }


  /*changePatternLength(value: SimpleSliderModel): void {
    this.pattern.setLengthInBars(value.value);
    this.updateCells();
  }*/
  changePatternLength(value: number): void {
    this.pattern.setLengthInBars(value);
    this.updateCells();
  }

  clipIsRunning(): boolean {
    return this.pattern && this.project.isRunningWithChannel(this.pattern.id);
  }

  onCellClicked(cell: NoteCell): void {
    if (!this.isResizing && !this.isDragging) {
      if (cell.column >= 0 && cell.row >= 0) {
        if (cell.data) this.sequencerService.removeEvent(this.eventCells,cell, this.pattern);
        else this.sequencerService.addNote(cell.x, cell.y, this.eventCells, this.specs, this.pattern);
      }
    }
  }
  mouseUp(cell: NoteCell): void {
    console.log(cell);
  }

  changeQuantization(value: NoteLength): void {
    this.pattern.quantization.next(value);
  }

  resizeStart(): void {
    this.isResizing = true;

  }

  dragStart(event: DragEvent, cell: Cell<any>): void {
    setTimeout(()=>{
      if (!this.isResizing)  this.dragHandler.onDragStart(event,cell);
    })
  }

  resizeEnd(cell:NoteCell): void {

    setTimeout(() => {
      this.isResizing = false;
      this.sequencerService.onResized(cell, this.pattern, this.specs);
    }, 10);
  }

 /* dragStart(): void {
    this.isDragging = true;

  }*/

 /* dragEnd(cell:NoteCell): void {

    setTimeout(() => {
      this.isDragging = false;
      this.sequencerService.updateEvent(cell,this.specs,this.pattern);
    })
  }*/

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
        this.subscriptions.push(this.pattern.noteInserted.subscribe(nextValue => {
          this.sequencerService.addCellWithNote(nextValue,this.eventCells,this.specs,this.pattern);
          this.updateCells();
        }));
        /*  this.subscriptions.push(this.pattern.quantizationEnabled.subscribe(nextValue => {
              this.dragHandler= new SequencerDragHandler();//  nextValue?new SequencerDragHandler():new RawDragHandler(this.cells);
          }));*/
        this.updateCells();
      }
    }
  }

  toggleRecord():void{
    this.project.record.emit(this.pattern);
  }

  private updateCells(): void {
    this.tableCells.length = 0;
    this.eventCells.length = 0;
    let newCells = this.sequencerService.createTableCells(this.pattern, this.specs);
    newCells.forEach(cell=>this.tableCells.push(cell));

    newCells = this.sequencerService.createEventCells(this.pattern, this.specs);
    newCells.forEach(cell=>this.eventCells.push(cell));
  }


}
