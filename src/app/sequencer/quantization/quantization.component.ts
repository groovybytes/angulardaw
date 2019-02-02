import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NoteLength} from "../../model/mip/NoteLength";

@Component({
  selector: 'quantization',
  templateUrl: './quantization.component.html',
  styleUrls: ['./quantization.component.scss']
})
export class QuantizationComponent implements OnInit {

  @Input() quantization: NoteLength;
  @Output() quantizationChanged: EventEmitter<NoteLength> = new EventEmitter<NoteLength>();

  constructor() {
  }

  ngOnInit() {
  }


}
