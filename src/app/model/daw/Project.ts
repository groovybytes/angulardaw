import {Scheduler} from "./Scheduler";
import {Transport} from "./Transport";
import {Track} from "./Track";
import {TransportProxy} from "./TransportProxy";
import {NoteLength} from "../mip/NoteLength";
import {TimeSignature} from "../mip/TimeSignature";

export class Project {

  get quantization(): NoteLength {
    return this._transport.quantization;
  }

  set quantization(value: NoteLength) {
    this._transport.quantization = value;
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

  tracks:Array<Track<any> >=[];
  readonly transport:TransportProxy;
  private readonly _transport:Transport;

  id:string;

  constructor(private scheduler:Scheduler){
    this._transport=new Transport(scheduler,120);
    this.transport=new TransportProxy(this._transport);
  }

  destroy():void{
    this.tracks.forEach(track=>track.destroy());
    this._transport.stop();
    this._transport.destroy();
  }
}
