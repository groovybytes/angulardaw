import {ErrorHandler, Injectable} from "@angular/core";

import {Subject} from "rxjs/internal/Subject";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";
import {SystemEvent} from "../model/system/SystemEvent";
import {SystemEventType} from "../model/system/SystemEventType";



@Injectable()
export class SystemMonitorService  implements HttpInterceptor,ErrorHandler  {

  events:Subject<SystemEvent>=new Subject<SystemEvent>();

  constructor() {

  }

  error(data:any):void{
    this.events.next(new SystemEvent(SystemEventType.ERROR,data));
  }
  debug(data:any):void{
    this.events.next(new SystemEvent(SystemEventType.DEBUG,data));
  }
  info(data:any):void{
    this.events.next(new SystemEvent(SystemEventType.INFO,data));
  }
  warn(data:any):void{
    this.events.next(new SystemEvent(SystemEventType.WARNING,data));
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      const error = err.error.message || err.statusText;
      this.error(error);
      return throwError(error);
    }))
  }

  handleError(error: any): void {
    let sendError = error?error.stack?error.stack:error:"";
    this.error(sendError);
  }

}
