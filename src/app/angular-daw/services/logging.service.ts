import {Injectable} from "@angular/core";


@Injectable()
export class LoggingService {

  constructor() {
  }

  public log(severity:string,msg): void {
    let _severity = severity.toLowerCase().trim();
    if (_severity==="debug") console.debug(msg);
    else if (_severity==="warn") console.warn(msg);
    else if (_severity==="info") console.info(msg);
    else if (_severity==="error") console.error(msg);
  }

  public startGroup(title:string,collapsed?): void {
    if (collapsed) console.groupCollapsed(title)
    else console.group(title);
  }

  public endGroup():void{
    console.groupEnd();
  }


}
