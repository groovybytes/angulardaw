import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Input() value:BehaviorSubject<number>;
  @Input() min:number=0;
  @Input() max:number=100;
  @Input() disabled:boolean=false;
  @Input() orientation:string="vertical";
  @Output() valueChanged:EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

}
