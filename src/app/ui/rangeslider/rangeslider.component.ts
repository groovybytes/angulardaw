import {Component, Input, OnInit} from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'rangeslider',
  templateUrl: './rangeslider.component.html',
  styleUrls: ['./rangeslider.component.scss']
})
export class RangesliderComponent implements OnInit {

  @Input() scaleStart:number;
  @Input() scaleEnd:number;

  constructor() { }

  ngOnInit() {
  }

}
