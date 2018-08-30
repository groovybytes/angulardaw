import {WindowSpecs} from "../visual/WindowSpecs";
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
  sequencerOpen: boolean;
  tracks: Array<TrackDto> = [];
  windows: Array<WindowSpecs> = [];
  transportSettings:TransportSettings;
}
