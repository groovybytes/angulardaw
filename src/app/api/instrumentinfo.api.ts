import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {InstrumentInfo} from "./InstrumentInfo";
import {AppConfiguration} from "../app.configuration";


@Injectable()
export class InstrumentInfoApi {
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  getInfo(name: string):Observable<InstrumentInfo> {
    return this.http.get<InstrumentInfo>(this.config.getUrl("instrumentinfo/"+name));
  }
}
