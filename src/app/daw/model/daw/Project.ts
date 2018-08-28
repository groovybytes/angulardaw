import {Track} from './Track';
import {Matrix} from "./matrix/Matrix";
import {WindowSpecs} from "./visual/WindowSpecs";
import {Transport} from "./transport/Transport";
import {BehaviorSubject} from "rxjs/internal/BehaviorSubject";
import {TimeSignature} from "../mip/TimeSignature";
import {MasterTransportParams} from "./transport/MasterTransportParams";
import {TransportParams} from "./transport/TransportParams";
import {EventEmitter} from "@angular/core";


export class Project {
  id: any;
  name: string = "default";
  /* bpm: number=120;
   quantization: number=NoteLength.Quarter;
   beatUnit:number=4;
   barUnit:number=4;*/
  metronomeEnabled: boolean = true;
  matrix: Matrix = new Matrix();
  selectedTrack: Track;
  sequencerOpen: boolean = false;
  readonly tracks: Array<Track> = [];
  windows: Array<WindowSpecs> = [];
  metronomeTrack:Track;
  readonly transport: Transport;
  ready:boolean=false;

  private bpmSubject: BehaviorSubject<number>;
  private signatureSubject: BehaviorSubject<TimeSignature>;

  trackAdded:EventEmitter<Track>=new EventEmitter();
  trackRemoved:EventEmitter<Track>=new EventEmitter();

  constructor(
    private audioContext: AudioContext,
    private transportParams: TransportParams,
    private bpm: number,
    private signature: TimeSignature) {

    this.bpmSubject = new BehaviorSubject<number>(bpm);
    this.signatureSubject = new BehaviorSubject<TimeSignature>(signature);
    let masterParams = new MasterTransportParams();
    masterParams.signature = this.signatureSubject.asObservable();
    masterParams.bpm = this.bpmSubject.asObservable();

    this.transport = new Transport(audioContext, transportParams,masterParams);
  }

  getTrack(id: string): Track {
    return this.tracks.find(track => track.id === id);
  }

  setBpm(bpm: number): void {

    this.bpmSubject.next(bpm);
  }

  setSignature(signature: TimeSignature): void {
    this.signatureSubject.next(signature);
  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }


}


