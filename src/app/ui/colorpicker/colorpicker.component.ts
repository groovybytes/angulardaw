import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})
export class ColorpickerComponent implements OnInit {

  @Input() color:string;
  @Input() colors:Array<string>;
  @Output() colorChanged:EventEmitter<string>=new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  selectColor(color:string):void{
    this.color=color;
    this.colorChanged.emit(color);
  }

}
