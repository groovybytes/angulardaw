import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NoteLength} from "../../model/mip/NoteLength";

@Component({
  selector: 'notelength',
  templateUrl: './notelength.component.html',
  styleUrls: ['./notelength.component.scss']
})
export class NotelengthComponent implements OnInit {


  @Output() noteLengthSelected: EventEmitter<NoteLength> = new EventEmitter<NoteLength>();

  constructor() { }

  ngOnInit() {
  }

}
