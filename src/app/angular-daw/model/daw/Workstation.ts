import {Transport} from "./Transport";
import {Project} from "./Project";
import {DawPlugin} from "../../plugins/DawPlugin";
import {EventEmitter} from "@angular/core";

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
    let project = new Project(this._audioContext);
    project.id = this.guid();
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

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
