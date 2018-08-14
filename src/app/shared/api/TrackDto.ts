import {PerformanceEvent} from "../../model/daw/events/PerformanceEvent";

export class TrackDto {
  id: any;
  index: number;
  name: string;
  pluginId:string;
  projectId:any;
  ghost:boolean=false;
  events:Array<PerformanceEvent<any>>;
}
