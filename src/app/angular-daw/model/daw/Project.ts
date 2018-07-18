import {TimeSignature} from "../mip/TimeSignature";
import {Scheduler} from "./Scheduler";
import {MusicMath} from "../utils/MusicMath";
import {Transport} from "./Transport";
import {NoteLength} from "../mip/NoteLength";
import {Track} from "./Track";

export class Project{

  tracks:Array<Track>=[];
  get quantization(): NoteLength {
    return this._quantization;
  }

  set quantization(value: NoteLength) {
    this._quantization = value;
  }

  private _quantization:NoteLength=NoteLength.Quarter;

  get bpm(): number {
    return this._transport.bpm;
  }

  set bpm(value: number) {
    this._transport.bpm= value;
  }

  id:string;

  private _transport:Transport;
  get transport(): Transport {
    return this._transport;
  }

  constructor(private scheduler:Scheduler){
    this._transport=new Transport(scheduler,120);
  }


}
