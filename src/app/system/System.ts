import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ApplicationError} from "./ApplicationError";
import {AppConfiguration} from "../app.configuration";
import {SystemNotification} from "./SystemNotification";

@Injectable()
export class System{
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  notifications:EventEmitter<SystemNotification>=new EventEmitter<SystemNotification>();
  errors:EventEmitter<ApplicationError>=new EventEmitter<ApplicationError>();

  error(msg:any):void{
    this.errors.emit(new ApplicationError(msg));
  }

  httpError(msg:any,url?:string):void{
    this.errors.emit(new ApplicationError(msg));
  }
  debug(msg:any):void{
    console.debug(msg);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:"debug"}).subscribe(result=>{});
  }

  info(msg:any):void{
    console.info(msg);
    this.http.post(this.config.getUrl("log"),{msg:msg,severity:"info"}).subscribe(result=>{});
  }

}
