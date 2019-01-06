import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {DeviceEvent} from "../../model/daw/devices/DeviceEvent";
import {PushService} from "../push.service";
import {Push} from "../model/Push";
import {BehaviorSubject, Subscription} from "rxjs";
import {PushMessage} from "../model/PushMessage";
import {PushSettings} from "../model/PushSettings";
import {KeyBindings} from "../model/KeyBindings";
import {PluginHost} from "../../model/daw/plugins/PluginHost";

@Component({
  selector: 'push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss']
})
export class PushComponent implements OnInit, OnDestroy {

  @Input() plugin:BehaviorSubject<PluginHost>=new BehaviorSubject(null);
  @Input() availablePlugins:Array<PluginHost>=[];
  @Input() settingsCollection: Array<PushSettings> = [];
  @Input() keyBindings: Array<KeyBindings>;
  @Output() deviceEvent: EventEmitter<DeviceEvent<any>> = new EventEmitter();

  private subscriptions: Array<Subscription> = [];

  constructor(@Inject("Push") private push: Push, private pushService: PushService) {
  }

  ngOnInit() {
    this.push.settingsCollection = this.settingsCollection;

    this.push.keyBindings = this.keyBindings;
    this.push.plugin=this.plugin;
    this.push.availablePlugins=this.availablePlugins;
    this.pushService.setup(this.plugin.getValue(),   this.push.settingsCollection);
    this.push.deviceEvent.subscribe((event:DeviceEvent<any>) => {
      let plugin = this.plugin.getValue();
      if (plugin) {
        //event.channels=[plugin.getInfo().id];
        this.deviceEvent.emit(event);
      }
    });
    this.push.message.next(new PushMessage("Welcome to push!"));




  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
  }


}
