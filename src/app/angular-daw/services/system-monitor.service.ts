import {Injectable} from "@angular/core";

import {Subject} from "rxjs/internal/Subject";
import {SystemEvent} from "../model/SystemEvent";
import {SystemEventType} from "../model/SystemEventType";



@Injectable()
export class SystemMonitorService {

  events:Subject<SystemEvent<any> >=new Subject<SystemEvent<any>>();

  constructor() {

  }

  httpError(reason):void{
    this.events.next(new SystemEvent<any>(SystemEventType.ERROR,reason));
  }

}
