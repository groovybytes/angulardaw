import {TrackDto} from "./TrackDto";
import {MatrixDto} from "./MatrixDto";
import {PatternDto} from "./PatternDto";
import {TransportSettings} from "../transport/TransportSettings";
import {AudioNodeDto} from "./AudioNodeDto";
import {PushSettings} from "../../../push/model/PushSettings";
import {KeyBindings} from "../../../push/model/KeyBindings";

export class ProjectDto{
  id: any;
  name: string;
  metronomeEnabled: boolean;
  selectedPattern:string;
  selectedTrack:string;
  matrix: MatrixDto;
  patterns:Array<PatternDto>;
  tracks: Array<TrackDto> = [];
  routes:Array<{source:string,target:string}>;
  nodes:Array<AudioNodeDto>;
  transportSettings:TransportSettings;
  pushSettings:PushSettings;
  pushKeyBindings:KeyBindings;
}
