import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {SystemMonitorService} from "../services/system-monitor.service";
import {AppConfiguration} from "../../app.configuration";
import {Observable} from "rxjs/internal/Observable";
import {InstrumentInfo} from "./InstrumentInfo";
import {map} from "rxjs/operators";


@Injectable()
export class InstrumentInfoApi {
  constructor(private http: HttpClient,
              private monitor: SystemMonitorService,
              private config: AppConfiguration) {

  }

  getInfo(name: string):Observable<InstrumentInfo> {
    return this.http.get<InstrumentInfo>(this.config.getUrl("instrumentinfo/"+name));
  }
}
