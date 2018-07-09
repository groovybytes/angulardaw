import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../app.configuration";
import {ApplicationError} from "./ApplicationError";
import {Severity} from "./Severity";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {Subject} from "rxjs/internal/Subject";


@Injectable()
export class MessagingService {
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  systemEvent:EventEmitter<ApplicationError>=new EventEmitter<ApplicationError>();

  log(msg:string, severity?:Severity):void{
    let _severity = severity?severity:Severity.DEBUG;
    this.consoleLog(msg,_severity);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:_severity.toString().toLowerCase()}).subscribe(result=>{});
  }

  logObject(o:any, severity?:Severity):void{
    let _severity = severity?severity:Severity.DEBUG;
    this.consoleLog(JSON.stringify(o),_severity);
    this.http.post(this.config.getUrl("log"),{msg:JSON.stringify(o),severity:_severity.toString().toLowerCase()}).subscribe(result=>{});
  }

  triggerEvent(event:ApplicationError):void{
    this.systemEvent.next(event);
  }

  notifyUser(msg:string,severity?:Severity):void{

  }

  private consoleLog(msg:string,severity:Severity): void {
    let _severity = severity.toString().toLowerCase().trim();
    if (_severity===Severity.DEBUG) console.debug(msg);
    else if (_severity===Severity.WARNING) console.warn(msg);
    else if (_severity===Severity.INFO) console.info(msg);
    else if (_severity===Severity.ERROR) console.error(msg);
  }
}
