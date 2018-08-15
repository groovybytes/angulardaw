import {NoteTriggerViewModel} from "./NoteTriggerViewModel";

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
}
