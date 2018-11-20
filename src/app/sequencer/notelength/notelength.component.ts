import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NoteLength} from "../../model/mip/NoteLength";

@Component({
  selector: 'notelength',
  templateUrl: './notelength.component.html',
  styleUrls: ['./notelength.component.scss']
})
export class NotelengthComponent implements OnInit {

  @Input() quantization: NoteLength;
  @Output() noteLengthSelected: EventEmitter<NoteLength> = new EventEmitter<NoteLength>();

  constructor() {
  }

  ngOnInit() {
  }

}
