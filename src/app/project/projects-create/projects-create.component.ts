import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {System} from "../../system/System";
import {AppConfiguration} from "../../app.configuration";
import {PluginInfo} from "../../model//daw/plugins/PluginInfo";
import {ProjectsService} from "../../shared/services/projects.service";
import {FilesApi} from "../../api/files.api";
import {ProjectsApi} from "../../api/projects.api";
import {Lang} from "../../model/utils/Lang";

@Component({
  selector: 'projects-create',
  templateUrl: './projects-create.component.html',
  styleUrls: ['./projects-create.component.scss']
})
export class ProjectsCreateComponent implements OnInit, OnDestroy {

  newProjectName: string;
  projects: Array<{id:string,name:string}> = [];
  drums: any;
  pluginTypes: Array<PluginInfo> = [];
  selectedPlugins: Array<PluginInfo> = [];
  msg: string;

  constructor(
    private route: Router,
    private system: System,
    private projectService: ProjectsService,
    private filesService: FilesApi,
    private config: AppConfiguration,
    private projectsApi: ProjectsApi) {

  }

  ngOnInit() {
    this.projectsApi.getAll().then(result => {
      this.projects = result.data;
    })
      .catch(error => console.log(error));

    this.filesService.getFile(this.config.getAssetsUrl("plugins.json"))
      .then(plugins => {
        this.pluginTypes = plugins;
        this.pluginTypes.filter(plugin => plugin.useInDefaultProjectTemplate).forEach(plugin => this.selectedPlugins.push(plugin));
      });

  }

  open(projectId: string): void {
    // this.workstation.openProject(projectViewModel.id);
    this.route.navigate(['/project/' + projectId]);
  }


  toggleInstrument(pluginId: string): void {
    this.msg = "";
    let plugin = this.pluginTypes.find(plugin => plugin.id === pluginId);
    let index = this.selectedPlugins.findIndex(plugin => plugin.id === pluginId);
    if (index >= 0) {
      this.selectedPlugins.splice(index, 1);
    }
    else this.selectedPlugins.push(plugin);

  }

  onSubmit(): void {
    if (this.selectedPlugins.length === 0) this.msg = "Musik machen ohne Instrument? Ist das dein Ernst?";
    else {
      let id = Lang.guid();


      this.projectService.createProjectSkeleton(id, this.newProjectName, this.selectedPlugins.map(plugin => plugin.id))
        .then(project => {
          this.projectService.saveProject(project)
            .then(()=>{
              this.projects.push(project);
            })
        })
        .catch(error => this.system.error(error));

      //this.open(id);
    }

  }

  ngOnDestroy(): void {
  }
}
