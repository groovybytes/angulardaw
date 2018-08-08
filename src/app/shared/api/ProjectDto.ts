import {TrackDto} from "./TrackDto";
import {Pattern} from "../../model/daw/Pattern";
import {GridDto} from "./GridDto";
import {NoteLength} from "../../model/mip/NoteLength";


export class ProjectDto {
  id: any;
  name: string="default";
  bpm: number=120;
  quantization: number=NoteLength.Quarter;
  signature: string="4,4";
  patterns: Array<Pattern>=[];
  tracks: Array<TrackDto>=[];
  grid: GridDto=new GridDto();
}
