import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";

@Component({
  selector: 'push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit {

  @Output() deviceEvent:EventEmitter<DeviceEvent<any> >=new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
