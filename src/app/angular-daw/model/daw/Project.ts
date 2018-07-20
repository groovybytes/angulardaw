import {TimeSignature} from "../mip/TimeSignature";
import {Scheduler} from "./Scheduler";
import {MusicMath} from "../utils/MusicMath";
import {Transport} from "./Transport";
import {NoteLength} from "../mip/NoteLength";
import {Track} from "./Track";

export class Project{

  tracks:Array<Track>=[];
  get quantization(): NoteLength {
    return this.transport.quantization;
  }

  set quantization(value: NoteLength) {
    this.transport.quantization = value;
  }

  get bpm(): number {
    return this._transport.bpm;
  }

  set bpm(value: number) {
    this._transport.bpm= value;
  }

  get signature(): TimeSignature {
    return this._transport.signature;
  }

  set signature(value: TimeSignature) {
    this._transport.signature= value;
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
