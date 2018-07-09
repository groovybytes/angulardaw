import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AppConfiguration} from "../../app.configuration";
import {SystemEvent} from "../model/system/SystemEvent";


@Injectable()
export class LoggingApi {
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  log(event:SystemEvent):void{
    this.http.post<SystemEvent>(this.config.getUrl("log"),event).subscribe(result=>{});
  }
}
