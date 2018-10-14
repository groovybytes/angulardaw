import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
/*import "jqueryui";*/
import {Pattern} from "../shared/model//daw/Pattern";
import {Project} from "../shared/model//daw/Project";
import {Subscription} from "rxjs/internal/Subscription";
import {NoteLength} from "../shared/model//mip/NoteLength";
import {PatternsService} from "../shared/services/patterns.service";


@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() project: Project;
  @Input() pattern: Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 50;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  private subscriptions: Array<Subscription> = [];

  constructor(private patternsService: PatternsService) {

  }


  ngOnInit() {


  }

  toggleClip(): void {
    this.patternsService.togglePattern(this.pattern.id, this.project);
  }

  clipIsRunning(): boolean {
    return this.pattern && this.project.isRunningWithChannel(this.pattern.id);
  }

  changeQuantization(value: NoteLength): void {
    this.pattern.quantization.next(value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      if (this.pattern) {
        this.subscriptions.forEach(subscr => subscr.unsubscribe());
      }
    }
  }

  toggleRecord(): void {
    this.project.record.emit(this.pattern);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }


}
