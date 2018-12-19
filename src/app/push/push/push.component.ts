import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {PushService} from "../push.service";
import {Push} from "../model/Push";
import {Subscription} from "rxjs";
import {PushMessage} from "../model/PushMessage";
import {PushSettings} from "../model/PushSettings";
import {KeyBindings} from "../model/KeyBindings";

@Component({
  selector: 'push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit,OnDestroy {

  @Input() settings:PushSettings;
  @Input() keyBindings:Array<KeyBindings>;
  @Output() deviceEvent:EventEmitter<DeviceEvent<any> >=new EventEmitter();

  private subscriptions:Array<Subscription>=[];

  constructor(@Inject("Push") private push: Push,private pushService:PushService) { }

  ngOnInit() {
    this.push.settings=this.settings;
    this.push.keyBindings=this.keyBindings;
    this.pushService.setup();
    this.push.deviceEvent.subscribe(event=>this.deviceEvent.emit(event));
    this.push.message.next(new PushMessage("Welcome to push!"));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr=>subscr.unsubscribe());
  }


}
