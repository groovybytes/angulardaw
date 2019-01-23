import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';

import {MusicMath} from "../../model//utils/MusicMath";
import {Pattern} from "../../model//daw/Pattern";
import {NoteCell} from "../model/NoteCell";
import {Project} from "../../model//daw/Project";
import {Subscription} from "rxjs/internal/Subscription";
import {ProjectsService} from "../../shared/services/projects.service";
import {Notes} from "../../model/mip/Notes";
import {SequencerService} from "../sequencer.service";
import {SequencerInteractionService} from "../sequencer.interaction.service";
import {EventTableModel} from "./event-table.model";
import {MouseTrapEvents} from "../mousetrap/MouseTrapEvents";
import {DawEventCategory} from "../../model/daw/DawEventCategory";


@Component({
  selector: 'event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: Project;
  @Input() pattern: Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 50;

  model: EventTableModel = new EventTableModel();
  allNotes: Array<string>;
  tick: number;
  private subscriptions: Array<Subscription> = [];
  private patternSubscriptions: Array<Subscription> = [];


  constructor(@Inject("Notes") private notes: Notes,
              @Inject("MouseEvents") private mouseEvents: MouseTrapEvents,
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              private interaction: SequencerInteractionService,
              private projectsService: ProjectsService,
              private sequencerService: SequencerService) {

    this.allNotes = notes.getAllIds();

  }


  ngOnInit() {


    this.subscriptions.forEach(subscr => subscr.unsubscribe());
    this.subscriptions.push(this.mouseEvents.click.subscribe(event => this.interaction.onClick(event, this.model)));
    this.subscriptions.push(this.mouseEvents.dblClick.subscribe(event => this.interaction.onDblClick(event, this.pattern, this.model)));
    this.subscriptions.push(this.mouseEvents.drag.subscribe(event =>
      this.interaction.onDrag(event, this.model, this.pattern)));
    this.subscriptions.push(this.mouseEvents.mouseOver.subscribe(event => this.interaction.onMouseOver(event, this.model, this.pattern)));
    this.subscriptions.push(this.mouseEvents.mouseOut.subscribe(event => this.interaction.onMouseOut(event, this.model)));
    this.subscriptions.push(this.mouseEvents.dragEnd.subscribe(event => this.interaction.onDragEnd()));
    this.subscriptions.push(
      this.project.subscribe([DawEventCategory.TICK],(event => {

        if (!event.data.countIn){
          let ticksPerBeat=MusicMath.getBeatTicks(this.pattern.quantization.getValue());
          let loopTicks =ticksPerBeat * this.pattern.length;
          this.tick = event.data.tick*ticksPerBeat % loopTicks;
          this.cdr.markForCheck();
        }

      })));

  }


  eventCellClicked(cell: NoteCell): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      if (this.pattern) {

        this.patternSubscriptions.forEach(subscr=>subscr.unsubscribe());

        this.patternSubscriptions.push(this.pattern.quantization.subscribe(nextValue => {

          if (nextValue) this.updateCells();

        }));
        this.patternSubscriptions.push(this.pattern.noteInserted.subscribe(nextValue => {
          this.sequencerService.addCellWithNote(nextValue, this.model.eventCells, this.model.specs, this.pattern);
          this.updateCells();
          this.cdr.markForCheck();
        }));
        this.patternSubscriptions.push(this.pattern.noteUpdated.subscribe(nextValue => {
          this.updateCells();
          this.cdr.markForCheck();
        }));
       /* this.patternSubscriptions.push(this.pattern.onDestroy.subscribe(() => {
          this.model.eventCells.length = 0;
          this.cdr.markForCheck();
        }));*/
        this.updateCells();
      }
    }
  }


  clipIsRunning(): boolean {
    return this.pattern && this.project.isRunningWithChannel(this.pattern.id);
  }

  private updateCells(): void {
    this.model.tableCells.length = 0;
    this.model.eventCells.length = 0;
    let newCells = this.sequencerService.createTableCells(this.pattern, this.model.specs);
    newCells.forEach(cell => this.model.tableCells.push(cell));

    newCells = this.sequencerService.createEventCells(this.pattern, this.model.specs);
    newCells.forEach(cell => this.model.eventCells.push(cell));

    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {

    this.subscriptions.forEach(subscr => subscr.unsubscribe());
    this.patternSubscriptions.forEach(subscr=>subscr.unsubscribe());
  }


}
