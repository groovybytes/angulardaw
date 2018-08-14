import {PerformanceEvent} from "../daw/events/PerformanceEvent";

export class TrackViewModel {
  constructor(id:string){
    this.id = id;
  }
  id: any;
  index: number;
  name: string;
  pluginId:string;
  projectId:any;
  ghost:boolean=false;
  events:Array<PerformanceEvent<any> >=[];
}
