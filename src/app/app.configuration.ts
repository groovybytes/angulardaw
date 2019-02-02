import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";

@Injectable()
export class AppConfiguration{


  getAssetsUrl(appendix:string):string{
    return environment.assetsUrl+appendix;
  }
  getUrl(appendix:string):string{
    return environment.apiUrl+appendix;
  }
}
