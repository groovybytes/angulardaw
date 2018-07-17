import {TimeSignature} from "../mip/TimeSignature";
import {Transport} from "./Transport";
import {MusicMath} from "../utils/MusicMath";

export class Project{
  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = value;
    this.transport.tickInterval=MusicMath.getBeatTime(value);
  }
  get context(): AudioContext {
    return this._context;
  }
  id:string;
  signature:TimeSignature=new TimeSignature(4,4);
  private _bpm:number=120;

  private _transport:Transport;
  get transport(): Transport {
    return this._transport;
  }

  constructor(private _context:AudioContext){
    this._transport=new Transport(()=>this._context.currentTime);
  }


}
