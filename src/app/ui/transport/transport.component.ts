import {Component, Input, OnInit} from '@angular/core';
import {TransportService} from "../../shared/services/transport.service";

@Component({
  selector: 'transport',
  templateUrl: './transport.component.html',
  styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit {

  transport:TransportService
  constructor(transport:TransportService) {
    this.transport=transport;
  }

  ngOnInit() {

  }

}
