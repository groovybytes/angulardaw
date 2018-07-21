import {Scheduler} from "./Scheduler";
import {Project} from "./Project";
import {DawPlugin} from "../../plugins/DawPlugin";
import {EventEmitter} from "@angular/core";
import {Lang} from "../utils/Lang";

export class Workstation{

  plugins: Array<DawPlugin> = [];
  public pluginAdded: EventEmitter<DawPlugin> = new EventEmitter<DawPlugin>();


  get audioContext(): AudioContext {
    return this._audioContext;
  }

  private projects:Array<Project>=[];

  constructor(private _audioContext:AudioContext){

  }

  createProject():Project{
    let scheduler = new Scheduler(()=>this._audioContext.currentTime);
    let project = new Project(scheduler);
    project.id = Lang.guid();
    this.projects.push(project);

    return project;
  }

  getProject(id:string):Project{
    return this.projects[0];//this.projects.filter(p=>p.id===id)[0];
  }

  register(plugin: DawPlugin): void {
    this.plugins.push(plugin);
    this.pluginAdded.emit(plugin);
  }

}
