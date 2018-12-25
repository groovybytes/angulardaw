import {TransportSettings} from "../transport/TransportSettings";
import {NoteEvent} from "../../mip/NoteEvent";
import {TriggerSpec} from "../TriggerSpec";

export class PatternDto {
  id: string;
  sceneId: string;
  length: number = 8; //beats
  events: Array<NoteEvent> = [];
  triggers:Array<TriggerSpec>=[];
  quantization: number;
  quantizationEnabled:boolean;
  settings: TransportSettings;

}
