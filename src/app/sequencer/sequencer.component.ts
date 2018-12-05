import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {Project} from "../model/daw/Project";
import {Pattern} from "../model/daw/Pattern";



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

  constructor(){

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

  //!todo
  /*getWindow():WindowInfo{
    return this.layout.getWindowInfo("sequencer");
  }*/

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }



}
