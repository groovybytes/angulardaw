import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'start-button',
  templateUrl: './press-button.component.html',
  styleUrls: ['./press-button.component.scss']
})
export class PressButtonComponent implements OnInit {

  buttonDownOnStartButton:boolean=false;
  on:boolean=false;
  @Input() baseColor:string;
  @Input() iconOn:string;
  @Input() iconOff:string;
  @Output() toggled:EventEmitter<boolean>=new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

  onMouseUp(): void {
    this.buttonDownOnStartButton=false;
    this.on=!this.on;
    this.toggled.emit(this.on);
  }

  onMouseDown(): void {
    this.buttonDownOnStartButton=true;
  }

}
