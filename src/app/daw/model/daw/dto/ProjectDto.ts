import {TrackDto} from "./TrackDto";
import {MatrixDto} from "./MatrixDto";
import {PatternDto} from "./PatternDto";
import {TransportSettings} from "../transport/TransportSettings";

export class ProjectDto{
  id: any;
  name: string;
  metronomeEnabled: boolean;
  selectedPattern:string;
  matrix: MatrixDto;
  patterns:Array<PatternDto>;
  openedWindows: Array<string>;
  tracks: Array<TrackDto> = [];
  transportSettings:TransportSettings;
}
