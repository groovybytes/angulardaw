import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApplicationError} from "./ApplicationError";
import {AppConfiguration} from "../app.configuration";
import {SystemNotification} from "./SystemNotification";
import {Severity} from "./Severity";

@Injectable()
export class System{
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  notifications:EventEmitter<SystemNotification>=new EventEmitter<SystemNotification>();
  errors:EventEmitter<ApplicationError>=new EventEmitter<ApplicationError>();

  notify(message:string,severity:Severity):System{
    this.notifications.next(new SystemNotification(message,severity));
    return this;
  }
  error(msg:any):System{
    this.errors.emit(new ApplicationError(msg));
    return this;
  }

  httpError(msg:any,url?:string):System{
    this.errors.emit(new ApplicationError(msg));
    return this;
  }

  debug(msg:any):System{
    console.debug(msg);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:"debug"}).subscribe(result=>{});
    return this;
  }
  warn(msg:any):System{
    console.warn(msg);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:"warn"}).subscribe(result=>{});
    return this;
  }

  info(msg:any):System{
    console.info(msg);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:"info"}).subscribe(result=>{});
    return this;
  }

}
