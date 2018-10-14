import {
  AfterViewInit,
  Component, ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';

import {MusicMath} from "../../shared/model//utils/MusicMath";
import {Pattern} from "../../shared/model//daw/Pattern";
import {NoteCell} from "../model/NoteCell";
import {SequencerD3Specs} from "../model/sequencer.d3.specs";
import {Project} from "../../shared/model//daw/Project";
import {Subscription} from "rxjs/internal/Subscription";
import {ProjectsService} from "../../shared/services/projects.service";
import {Notes} from "../../shared/model/daw/Notes";
import {SequencerService} from "../sequencer.service";


@Component({
  selector: 'event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: Project;
  @Input() pattern: Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 50;

  @ViewChildren("tablecell") cellChildren:QueryList<ElementRef>;
  @ViewChildren("eventcell") eventCellChildren:QueryList<ElementRef>;

  /*@HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    this.interactionService.mouseMove(this.element,e);
  }
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(e) {
    this.interactionService.mouseUp();
  }*/

  /*  @ViewChild("card") card: ElementRef;*/
  readonly tableCells: Array<NoteCell> = [];
  readonly eventCells: Array<NoteCell> = [];
  allNotes: Array<string>;
  tick: number;
  specs: SequencerD3Specs = new SequencerD3Specs();
  private subscriptions: Array<Subscription> = [];

  constructor(@Inject("Notes") private notes: Notes,
              private projectsService: ProjectsService,
              private sequencerService: SequencerService) {

    this.allNotes = notes.getAllIds();
  }

  /* getTime(column: number): number {
     return MusicMath.getTickTime(this.pattern.transportContext.settings.global.bpm,
       this.pattern.quantization.getValue()) * column;
   }*/

  ngOnInit() {


  }


  mouseDown(cell: NoteCell,event:MouseEvent): void {
    // this.interactionService.mouseDown(event,cell, this.eventCells, this.pattern, this.specs);
  }
  mouseOver(cell: NoteCell): void {
    //this.interactionService.mouseOver(cell);
  }
  mouseLeave(cell: NoteCell): void {
    // this.interactionService.mouseLeave(cell);
  }
  dblClick(cell: NoteCell): void {
    //this.interactionService.dblClick(cell);
  }
  emptyCellDblClick(cell: NoteCell): void {
    this.sequencerService.addNote(cell.x, cell.y, this.eventCells, this.specs, this.pattern);
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
        this.subscriptions.push(this.pattern.noteInserted.subscribe(nextValue => {
          this.sequencerService.addCellWithNote(nextValue, this.eventCells, this.specs, this.pattern);
          this.updateCells();
        }));
        this.updateCells();
      }
    }
  }


  clipIsRunning(): boolean {
    return this.pattern && this.project.isRunningWithChannel(this.pattern.id);
  }
  private updateCells(): void {
    this.tableCells.length = 0;
    this.eventCells.length = 0;
    let newCells = this.sequencerService.createTableCells(this.pattern, this.specs);
    newCells.forEach(cell => this.tableCells.push(cell));

    newCells = this.sequencerService.createEventCells(this.pattern, this.specs);
    newCells.forEach(cell => this.eventCells.push(cell));
  }

  ngOnDestroy(): void {

  }


}
