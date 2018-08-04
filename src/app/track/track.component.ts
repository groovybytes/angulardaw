import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Project} from "../model/daw/Project";
import {Track} from "../model/daw/Track";

@Component({
  selector: 'daw-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit,OnChanges {

  @Input() project:Project;
  @Input() track:Track;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

}
