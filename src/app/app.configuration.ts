import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AppConfiguration{


  getAssetsUrl(appendix:string):string{
    return "http://localhost:3000/assets/"+appendix;
  }
  getUrl(appendix:string):string{
    return "http://localhost:3000/v1/"+appendix;
  }
}
