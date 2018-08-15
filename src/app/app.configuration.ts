import {Injectable} from "@angular/core";

@Injectable()
export class AppConfiguration{


  getAssetsUrl(appendix:string):string{
    return "http://localhost:3000/assets/"+appendix;
  }
  getUrl(appendix:string):string{
    return "http://localhost:3000/api/"+appendix;
  }
}
