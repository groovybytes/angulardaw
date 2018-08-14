import {Component, Inject, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {Router} from "@angular/router";
import {System} from "../system/System";
import {AuthService} from "../shared/services/auth.service";
import {ProjectViewModel} from "../model/viewmodel/ProjectViewModel";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectsService} from "../shared/services/projects.service";

@Component({
  selector: 'projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  newProjectName: string;
  projects: Array<ProjectViewModel> = [];


  constructor(
    private route: Router,
    private system: System,
    private auth: AuthService,
    private projectService:ProjectsService,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectViewModel>) {

  }

  ngOnInit() {
    this.projectsApi.find().subscribe(projects => {
      this.projects = projects;
    }, error => console.log(error));
  }

  open(project: ProjectViewModel): void {
    // this.workstation.openProject(projectViewModel.id);
    this.route.navigate(['/main/' + project.id]);
  }

  onSubmit(): void {
    let project = this.projectService.createProject(this.newProjectName);
    this.projectsApi.post(project).subscribe(project => {
      this.projects.push(project);
      console.log("projectViewModel saved");
    }, error => this.system.error(JSON.stringify(error)));
  }
}
