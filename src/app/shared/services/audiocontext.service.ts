import {Injectable} from "@angular/core";

declare var webkitAudioContext;
declare var mozAudioContext;
declare var msAudioContext;
declare var oAudioContext;

@Injectable()
export class AudioContextService {


  private context: AudioContext;

  constructor() {

  }

 /* destroy():Promise<void>{
   /!* console.log("destroy audio context");
    let context = this.context;
    this.context=null;
    let promise =  this.context.close();
    promise.then(()=>this.context=null);
    return promise;*!/
  }*/

  getAudioContext(): AudioContext {
    if (!this.context){
      this.context = this.create();
    }
    return this.context;
  }

  private create(): AudioContext {
    let ContextClass = (AudioContext || webkitAudioContext || mozAudioContext || oAudioContext || msAudioContext);
    return new ContextClass();
  }

}
