import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AppConfiguration} from "../../app.configuration";
import {Observable} from "rxjs/internal/Observable";
import {InstrumentInfo} from "./InstrumentInfo";


@Injectable()
export class InstrumentInfoApi {
  constructor(private http: HttpClient,
              private config: AppConfiguration) {

  }

  getInfo(name: string):Observable<InstrumentInfo> {
    return this.http.get<InstrumentInfo>(this.config.getUrl("instrumentinfo/"+name));
  }
}
