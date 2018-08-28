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
import {SequencerService} from "./sequencer.service";
import {MusicMath} from "../model/utils/MusicMath";
import {TheoryService} from "../shared/services/theory.service";
import {NoteLength} from "../model/mip/NoteLength";
import {Track} from "../model/daw/Track";
import "jqueryui";
import {Pattern} from "../model/daw/Pattern";
import {SequencerD3} from "./sequencer.d3";
import {NoteCell} from "./model/NoteCell";
import {TracksService} from "../shared/services/tracks.service";
import {SequencerD3Specs} from "./model/sequencer.d3.specs";
import {WindowSpecs} from "../model/daw/visual/WindowSpecs";
import {ClipsService} from "../shared/services/clips.service";
import {Project} from "../model/daw/Project";

@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnChanges {

  @Input() project: Project;
  @Input() track: Track;
  @Input() pattern:Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 100;
  @Input() window:WindowSpecs;
  @Output() close:EventEmitter<void>=new EventEmitter<void>();


  @ViewChild("card") card:ElementRef;
  @ViewChild("svg") svg:ElementRef;
  cells: Array<NoteCell> = [];
  allNotes: Array<string>;

  private renderer:SequencerD3;
  private specs: SequencerD3Specs=new SequencerD3Specs();
  private quantization: NoteLength;

  constructor(private element: ElementRef,
              private theoryService: TheoryService,
              private tracksService:TracksService,
              private clipsService:ClipsService,
              private sequencerService: SequencerService) {


    this.allNotes = theoryService.getAllIds();
  }

  getTime(column: number): number {
    return MusicMath.getTickTime(this.track.transport.getBpm(),
      this.track.transport.getQuantization()) * column;
  }

  ngOnInit() {

    this.sequencerService.initializeWindow(this.card.nativeElement,this.window);
    this.sequencerService.updateWindow(this.card.nativeElement,this.window);

    this.track.transport.params.quantization.subscribe(nextValue => {
      if (this.track && this.track.focusedPattern && this.quantization !== nextValue) {
        this.quantization = nextValue;
        this.updateCells();

        this.renderer.render(this.pattern,this.cells);
      }
    });

    this.track.transport.transportEnd.subscribe(() => this.renderer.updatePosition(0));
  }

  toggleClip(): void {
    this.clipsService.toggleClip(this.pattern,this.track);
  }




  clipIsRunning(): boolean{
    return this.clipsService.clipIsRunning(this.track.id,this.pattern,this.project);
  }


/*  onGridEntryAdded(cell: NoteCell): void {
    //this.sequencerService.addNote(cell, this.specs, this.track.focusedPattern, this.transportService.params);

  }

  onGridEntryUpdated(cell: NoteCell): void {
    this.sequencerService.updateEvent(cell, this.specs, this.track.focusedPattern,
      this.transportService.params);
  }

  onGridEntryRemoved(cell: NoteCell): void {
    this.sequencerService.removeEvent(cell, this.track.focusedPattern);
  }*/

  /*  onEventCellClicked(event: any, cell: EventCell): void {
      //this.sequencerService.onEventCellClicked(cell, this.eventCells, this.pattern);

    }*/


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      if (!this.renderer) this.renderer=new SequencerD3(
        this.svg.nativeElement,
        this.specs,
        this.track,
        this.sequencerService);
      this.updateCells();
      this.renderer.render(this.pattern,this.cells);

    }
  }

  private updateCells(): void {
    this.quantization = this.track.transport.getQuantization();
    this.cells.length = 0;
    this.cells = this.sequencerService.createCells(this.track.focusedPattern, this.track.transport, this.specs);
  }




}
