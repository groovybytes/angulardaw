import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {System} from "../../system/System";
import {AppConfiguration} from "../../app.configuration";
import {PluginInfo} from "../../shared/model//daw/plugins/PluginInfo";
import {ProjectDto} from "../../shared/model//daw/dto/ProjectDto";
import {ProjectsService} from "../../shared/services/projects.service";
import {FilesApi} from "../../api/files.api";
import {ProjectsApi} from "../../api/projects.api";

@Component({
  selector: 'projects-create',
  templateUrl: './projects-create.component.html',
  styleUrls: ['./projects-create.component.scss']
})
export class ProjectsCreateComponent implements OnInit, OnDestroy {

  newProjectName: string;
  projects: Array<any> = [];
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
    this.projectsApi.getAll().then(projects => {
      this.projects = projects;
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

  /*  onSubmit2(): void {
      if (this.selectedPlugins.length === 0) this.msg = "Musik machen ohne Instrument? Ist das dein Ernst?";
      else {
        let project = this.projectService.createProject(this.newProjectName, this.selectedPlugins);
        this.projectService.save(project).then(() => {
          this.projects.push(project);
          project.destroy()
        })
          .catch(error => this.system.error(error));
      }

    }*/

  onSubmit(): void {
    if (this.selectedPlugins.length === 0) this.msg = "Musik machen ohne Instrument? Ist das dein Ernst?";
    else {
      let id = this.projectService.guid();
      localStorage.setItem("new_project", JSON.stringify({
        plugins: this.selectedPlugins.map(plugin => plugin.id)
      }));

      this.open(id);
    }

  }

  ngOnDestroy(): void {
  }
}
