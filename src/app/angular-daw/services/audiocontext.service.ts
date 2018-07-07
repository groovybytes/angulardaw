import {Injectable} from "@angular/core";
import {FileService} from "./file.service";
import {Sample} from "../model/Sample";


@Injectable()
export class AudioContextService {

  private _context:AudioContext;

  constructor(file:FileService){

  }

  public context():AudioContext{
    if (!this._context) this._context=new AudioContext();
    return this._context;
  }

}
