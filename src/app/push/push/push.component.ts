import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {PushService} from "../push.service";
import {Push} from "../model/Push";
import {Subscription} from "rxjs";
import {PushMessage} from "../model/PushMessage";
import {PushConfig} from "../model/PushConfig";

@Component({
  selector: 'push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit,OnDestroy {

  @Input() config:PushConfig;
  @Output() deviceEvent:EventEmitter<DeviceEvent<any> >=new EventEmitter();

  private subscriptions:Array<Subscription>=[];

  constructor(@Inject("Push") private push: Push,private pushService:PushService) { }

  ngOnInit() {
    this.push.config=this.config;
    this.pushService.setup(8);
    this.push.deviceEvent.subscribe(event=>this.deviceEvent.emit(event));
    this.push.message.next(new PushMessage("Welcome to push!"));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr=>subscr.unsubscribe());
  }


}
