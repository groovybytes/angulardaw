import {Track} from './Track';
import {WstPlugin} from "./WstPlugin";
import {NoteLength} from "../mip/NoteLength";
import {Matrix} from "./matrix/Matrix";
import {Pattern} from "./Pattern";
import {WindowSpecs} from "./visual/WindowSpecs";



export class Project {
  id: any;
  name: string="default";
  bpm: number=120;
  quantization: number=NoteLength.Quarter;
  beatUnit:number=4;
  barUnit:number=4;
  metronomeEnabled:boolean=true;
  metronome:WstPlugin;
  matrix:Matrix=new Matrix();
  selectedTrack:Track;
  sequencerOpen:boolean=false;
  readonly tracks: Array<Track> = [];
  windows:Array<WindowSpecs>=[];

  constructor() {

  }

  destroy(): void {
    this.tracks.forEach(track => track.destroy());
  }


}


