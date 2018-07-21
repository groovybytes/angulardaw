import {ErrorHandler, Inject, Injectable} from "@angular/core";
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs/internal/observable/throwError";
import {ApplicationError} from "./ApplicationError";
import {Severity} from "./Severity";
import {System} from "./System";
import {AppConfiguration} from "../app.configuration";


@Injectable()
export class SystemMonitorService implements HttpInterceptor, ErrorHandler {


  constructor(private system: System,private http: HttpClient,private config: AppConfiguration,@Inject("lodash") _) {

    let postError=_.throttle((error)=>this.post(error),500);
    system.errors.subscribe((error)=>{
      console.log(JSON.stringify(error));
      postError(error);
      throw error.data;
    })
  }

  private post(error):void{
    this.http.post(this.config.getUrl("log"),{msg:JSON.stringify(error),severity:"error"}).subscribe(result=>{});
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      const error = err.error.message || err.statusText;
      this.system.errors.emit(new ApplicationError(error));
      return throwError(error);
    }))
  }

  handleError(error: any): void {
    let sendError = error ? error.stack ? error.stack : error : "";
    this.system.errors.emit(new ApplicationError(sendError));
  }

}
