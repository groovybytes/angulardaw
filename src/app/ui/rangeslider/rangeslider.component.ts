import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Input() value:number=0;
  @Input() min:number=0;
  @Input() max:number=100;
  @Input() disabled:boolean=false;
  @Output() valueChanged:EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onChange(value:number):void{
    this.valueChanged.emit(value);
  }

}
