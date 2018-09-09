import {TrackControlParametersDto} from "./TrackControlParametersDto";
import {PluginDto} from "./PluginDto";
import {TrackCategory} from "../TrackCategory";

export class TrackDto{
  id: string;
  index: number;
  category:TrackCategory;
  name: string;
  color:string;
  inputNode:string;
  outputNode:string;
  plugins:Array<PluginDto>;
  controlParameters: TrackControlParametersDto;
}
