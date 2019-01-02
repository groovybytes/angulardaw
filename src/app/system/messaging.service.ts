import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../app.configuration";
import {Severity} from "./Severity";


@Injectable()
export class MessagingService {
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  systemEvent:EventEmitter<any>=new EventEmitter<any>();

  log(msg:string, severity?:Severity):void{
    let _severity = severity?severity:Severity.DEBUG;
    this.consoleLog(msg,_severity);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:_severity.toString().toLowerCase()}).subscribe(result=>{});
  }

  logObject(o:any, severity?:Severity):void{
    let _severity = severity?severity:Severity.DEBUG;
    this.consoleLog(o,_severity);
    //this.http.post(this.config.getUrl("log"),{msg:JSON.stringify(o),severity:_severity.toString().toLowerCase()}).subscribe(result=>{});
  }

  triggerEvent(event:any):void{
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
