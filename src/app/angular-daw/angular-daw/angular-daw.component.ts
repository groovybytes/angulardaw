import {Component, OnInit} from '@angular/core';
import {AngularDawService} from "../services/angular-daw.service";
import {SystemMonitorService} from "../services/system-monitor.service";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'angular-daw',
  templateUrl: './angular-daw.component.html',
  styleUrls: ['./angular-daw.component.scss']
})
export class AngularDawComponent implements OnInit {

  constructor(private dawService: AngularDawService,
              private monitor: SystemMonitorService,
              private notification: NotificationService) {
  }

  ngOnInit() {
    this.monitor.events.subscribe(event => {
        this.notification.info(event.data);
    })
    this.dawService.bootstrap();
  }
}
