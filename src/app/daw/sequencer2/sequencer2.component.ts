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
import {NoteLength} from "../model/mip/NoteLength";
import {Track} from "../model/daw/Track";
import "jqueryui";
import {Pattern} from "../model/daw/Pattern";
import {NoteCell} from "./model/NoteCell";
import {TracksService} from "../shared/services/tracks.service";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {WindowSpecs} from "../model/daw/visual/WindowSpecs";
import {ClipsService} from "../shared/services/clips.service";
import {Project} from "../model/daw/Project";
import {SequencerService2} from "./sequencer2.service";
import {DragHandler} from "./DragHandler";


@Component({
  selector: 'sequencer2',
  templateUrl: './sequencer2.component.html',
  styleUrls: ['./sequencer2.component.scss']
})
export class Sequencer2Component implements OnInit, OnChanges {

  @Input() project: Project;
  @Input() track: Track;
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

  private isResizing:boolean=false;
  private specs: SequencerD3Specs = new SequencerD3Specs();
  private quantization: NoteLength;

  constructor(private element: ElementRef,
              private theoryService: TheoryService,
              private tracksService: TracksService,
              private clipsService: ClipsService,
              private sequencerService: SequencerService2) {


    this.allNotes = theoryService.getAllIds();
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.track.transport.getBpm(),
      this.track.transport.getQuantization()) * column;
  }

  ngOnInit() {

    this.sequencerService.initializeWindow(this.card.nativeElement, this.window);
    this.sequencerService.updateWindow(this.card.nativeElement, this.window);

    this.track.transport.time.subscribe(time => {
      this.tick = MusicMath.getTickForTime(time * 1000, this.track.transport.getBpm(), this.track.transport.getQuantization());
    });

    this.track.transport.params.quantization.subscribe(nextValue => {
      if (this.track && this.track.focusedPattern && this.quantization !== nextValue) {
        this.quantization = nextValue;
        this.updateCells();

      }
    });

    //this.track.transport.transportEnd.subscribe(() => this.renderer.updatePosition(0));
  }

  toggleClip(): void {
    this.clipsService.toggleClip(this.pattern, this.track);
  }

  clipIsRunning(): boolean {
    return this.clipsService.clipIsRunning(this.track.id, this.pattern, this.project);
  }

  onCellClicked(cell: NoteCell): void {
    if (!this.isResizing){
      if (cell.column >= 0 && cell.row >= 0) {
        if (cell.data) this.sequencerService.removeEvent(cell, this.pattern);
        else this.sequencerService.addNote(cell.x, cell.y, this.cells, this.specs, this.pattern, this.track.transport);
      }
    }
  }

  getHeaderCells(): Array<NoteCell> {
    return this.cells.filter(cell => cell.row === -1);
  }

  resizeStart():void{
   this.isResizing=true;

  }

  resizeEnd(elementTarget:EventTarget):void{

    setTimeout(()=>{
     this.isResizing=false;
     this.sequencerService.onResized(elementTarget,this.cells,this.pattern,this.specs,this.track.transport);
   },10);
  }

  onDrop(event: DragEvent): void {
    let cells = this.sequencerService.onDrop(event, this.cells);
    this.sequencerService.moveCell(cells.source, cells.target);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {

      this.updateCells();

    }
  }

  private updateCells(): void {
    this.quantization = this.track.transport.getQuantization();
    this.cells.length = 0;
    this.cells = this.sequencerService.createCells(this.track.focusedPattern, this.track.transport, this.specs);
  }


}
