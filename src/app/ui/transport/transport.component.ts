import {Component, Input, OnInit} from '@angular/core';
import {Transport} from "../../model/daw/Transport";

@Component({
  selector: 'transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  @Input() transport:Transport;

  constructor() { }

  ngOnInit() {

  }

}
