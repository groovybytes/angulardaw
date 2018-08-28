import {Component, Input, OnInit} from '@angular/core';
import {TransportParams} from "../model/daw/transport/TransportParams";

@Component({
  selector: 'quantization',
  templateUrl: './quantization.component.html',
  styleUrls: ['./quantization.component.scss']
})
export class QuantizationComponent implements OnInit {

  @Input() params:TransportParams;

  constructor() { }

  ngOnInit() {
  }

  setQuantization(value:number):void{
    this.params.quantization.next(value);
  }
}
