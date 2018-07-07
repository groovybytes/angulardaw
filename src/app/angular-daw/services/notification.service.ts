import {Injectable} from "@angular/core";

declare var toastr;

@Injectable()
export class NotificationService {

  error(msg:string):void{
    toastr.info('Are you the 6 fingered man?')
  }
  info(msg:string):void{
    toastr.info('Are you the 6 fingered man?')
  }
  success(msg:string):void{

  }
  warn(msg:string):void{

  }

}
