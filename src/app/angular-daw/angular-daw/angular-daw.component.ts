import {AfterContentInit, AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AngularDawService} from "../services/angular-daw.service";
import {SystemMonitorService} from "../services/system-monitor.service";
import {LoggingApi} from "../api/logging.api";
import {SystemEventType} from "../model/system/SystemEventType";
import {SystemEvent} from "../model/system/SystemEvent";


@Component({
  selector: 'angular-daw',
  templateUrl: './angular-daw.component.html',
  styleUrls: ['./angular-daw.component.scss']
})
export class AngularDawComponent implements OnInit {

  constructor(private dawService: AngularDawService,
              private monitor: SystemMonitorService,
              private logApi:LoggingApi) {
  }

  ngOnInit() {


    this.monitor.events.subscribe(event => {
      if (event.eventType===SystemEventType.ERROR) {
        //debugger;
      }
      if (!event) debugger;
      this.logApi.log(event);
      this.consoleLog(event);
    });
    this.dawService.bootstrap();
  }

  public consoleLog(event:SystemEvent): void {
    let _severity = event.eventType.toString().toLowerCase().trim();
    if (_severity==="debug") console.debug(JSON.stringify(event));
    else if (_severity==="warn") console.warn(JSON.stringify(event));
    else if (_severity==="info") console.info(JSON.stringify(event));
    else if (_severity==="error") console.error(JSON.stringify(event));
  }





}
