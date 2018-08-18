import {NoteTriggerViewModel} from "./NoteTriggerViewModel";
import {TrackControlParameters} from "./TrackControlParameters";

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
  events:Array<NoteTriggerViewModel>=[];
  controlParameters:TrackControlParameters=new TrackControlParameters();
}
