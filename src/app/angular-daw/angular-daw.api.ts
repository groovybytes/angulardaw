import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {AppConfiguration} from "../app.configuration";
import {InstrumentsEnum} from "./model/InstrumentsEnum";
import {Sample} from "./model/Sample";
import {FileService} from "./services/file.service";

@Injectable()
export class AngularDawApi {

  constructor(private http: HttpClient, private config: AppConfiguration, private sampleService: FileService) {

  }

  writeFile(file, path: string): Observable<any> {
    let url = this.config.getUrl("files/write");
    return this.http.post(url, file);
  }


}
