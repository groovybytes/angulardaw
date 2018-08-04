import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AppConfiguration{

  getAssetsUrl(appendix:string):string{
    return "http://localhost:5000/"+appendix;
  }
  getUrl(appendix:string):string{
    return "http://localhost:5000/api/"+appendix;
  }
}
