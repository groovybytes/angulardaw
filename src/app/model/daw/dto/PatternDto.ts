
import {TransportSettings} from "../transport/TransportSettings";
import {NoteEvent} from "../../mip/NoteEvent";

export class PatternDto {
  id: string;
  sceneId: string;
  length: number = 8; //beats
  events: Array<NoteEvent> = [];
  notes: Array<string> = [];
  quantization: number;
  quantizationEnabled:boolean;
  settings: TransportSettings;

}
