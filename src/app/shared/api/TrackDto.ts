import {PerformanceEvent} from "../../model/daw/events/PerformanceEvent";

export class TrackDto {
  id: any;
  index: number;
  name: string;
  pluginId:string;
  projectId:any;
  events:Array<PerformanceEvent<any>>;
}
