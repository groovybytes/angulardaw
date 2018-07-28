import {Scheduler} from "./Scheduler";
import {Project} from "./Project";
import {Lang} from "../utils/Lang";

export class Workstation{



  get audioContext(): AudioContext {
    return this._audioContext;
  }

  private projects:Array<Project>=[];

  constructor(private _audioContext:AudioContext){

  }

  createProject():Project{
    let project = new Project(this._audioContext);
    project.id = Lang.guid();
    this.projects.push(project);

    return project;
  }

  getProject(id:string):Project{
    return this.projects[0];//this.projects.filter(p=>p.id===id)[0];
  }

  getOpenProject():Project{
    return this.projects[0];
  }


}
