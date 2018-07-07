import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AppConfiguration{


  getUrl(appendix:string):string{
    return "http://localhost:3000/api/"+appendix;
  }
}
