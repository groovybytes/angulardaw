import {TrackControlParametersDto} from "./TrackControlParametersDto";

export class TrackDto{
  id: string;
  index: number;
  name: string;
  color:string;
  pluginId: string;
  controlParameters: TrackControlParametersDto;
}
