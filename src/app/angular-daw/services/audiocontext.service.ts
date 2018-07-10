import {Injectable} from "@angular/core";

@Injectable()
export class AudioContextService {

  private _context:AudioContext;

  constructor(){

  }

  public context():AudioContext{
    if (!this._context) this._context=new AudioContext();
    return this._context;
  }


}
