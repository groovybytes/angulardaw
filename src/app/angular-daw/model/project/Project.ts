import {Track} from "./Track";
import {TimeSignature} from "../mip/TimeSignature";


export class Project{
  get bpm(): number {
    return this._bpm;
  }

  set bpm(value: number) {
    this._bpm = value;
  }

  get signature(): TimeSignature {
    return this._signature;
  }

  set signature(value: TimeSignature) {
    this._signature = value;
  }
  private _bpm:number;
  private _signature:TimeSignature;
  tracks:Array<Track>=[];

}
