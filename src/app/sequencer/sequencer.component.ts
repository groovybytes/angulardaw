import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {Project} from "../model/daw/Project";
import {Pattern} from "../model/daw/Pattern";
import {LayoutManagerService} from "../shared/services/layout-manager.service";


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

  constructor(private layout:LayoutManagerService){

  }

  ngOnInit() {


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pattern) {
      if (this.pattern) {
        this.subscriptions.forEach(subscr => subscr.unsubscribe());
      }
    }
  }

  getWindow():DesktopWindow{
    return this.layout.getWindow("sequencer");
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }



}
