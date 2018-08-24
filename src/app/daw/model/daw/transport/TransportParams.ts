import {BehaviorSubject} from "rxjs";
import {NoteLength} from "../../mip/NoteLength";

export class TransportParams {

  constructor(private _quantization:NoteLength,
              private _loopStart:number,
              private _loopEnd:number,
              private _loop:boolean){
    this.quantization=new BehaviorSubject(_quantization);
    this.loopStart=new BehaviorSubject(_loopStart);
    this.loopEnd=new BehaviorSubject(_loopEnd);
    this.loop=new BehaviorSubject(_loop);
  }

  quantization: BehaviorSubject<NoteLength>;
  loopStart: BehaviorSubject<number>;
  loopEnd:  BehaviorSubject<number>;
  loop: BehaviorSubject<boolean>;
  metronomeEnabled: BehaviorSubject<boolean>;

}
