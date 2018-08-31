import {NoteTrigger} from "../NoteTrigger";
import {TransportSettings} from "../transport/TransportSettings";

export class PatternDto {
  id: string;
  sceneId: string;
  length: number = 8; //beats
  events: Array<NoteTrigger> = [];
  notes: Array<string> = [];
  quantization: number;
  quantizationEnabled:boolean;
  settings: TransportSettings;

}
