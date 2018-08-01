import {TrackDTO} from "./TrackDTO";

export interface ProjectDTO{
  id:any;
  name:string;
  bpm:number;
  quantization:number;
  signature:Array<number>;
  tracks:TrackDTO[];
}
