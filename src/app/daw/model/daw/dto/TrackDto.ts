import {TrackControlParametersDto} from "./TrackControlParametersDto";

export class TrackDto{
  id: string;
  index: number;
  name: string;
  pluginId: string;
  controlParameters: TrackControlParametersDto;
}
