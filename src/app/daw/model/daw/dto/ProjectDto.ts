import {TrackDto} from "./TrackDto";
import {MatrixDto} from "./MatrixDto";
import {PatternDto} from "./PatternDto";
import {TransportSettings} from "../transport/TransportSettings";
import {AudioNodeDto} from "./AudioNodeDto";
import {DesktopManager} from "../visual/desktop/DesktopManager";

export class ProjectDto{
  id: any;
  name: string;
  metronomeEnabled: boolean;
  selectedPattern:string;
  selectedTrack:string;
  matrix: MatrixDto;
  patterns:Array<PatternDto>;
  openedWindows: Array<string>;
  tracks: Array<TrackDto> = [];
  routes:Array<{source:string,target:string}>;
  nodes:Array<AudioNodeDto>;
  desktop:DesktopManager;
  transportSettings:TransportSettings;
}
