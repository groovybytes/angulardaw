import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs/internal/Subscription";
import {Project} from "../model/daw/Project";
import {Pattern} from "../model/daw/Pattern";
import {Track} from "../model/daw/Track";



@Component({
  selector: 'sequencer',
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnDestroy {

  @Input() project: Project;
  @Input() track: Track;
  @Input() pattern: Pattern;
  @Input() cellWidth: number = 50;
  @Input() cellHeight: number = 50;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  private subscriptions: Array<Subscription> = [];

  constructor(){

  }

  ngOnInit() {


    this.subscriptions.push(this.pattern.onDestroy.subscribe(() => {
      this.pattern=null;
    }));
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }



}
