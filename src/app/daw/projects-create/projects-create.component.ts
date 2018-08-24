import {Component, Inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectsService} from "../shared/services/projects.service";
import {Project} from "../model/daw/Project";
import {System} from "../../system/System";

@Component({
  selector: 'projects-create',
  templateUrl: './projects-create.component.html',
  styleUrls: ['./projects-create.component.scss']
})
export class ProjectsCreateComponent implements OnInit {

  newProjectName: string;
  projects: Array<any> = [];


  constructor(
    private route: Router,
    private system: System,
    private projectService: ProjectsService,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<any>) {

  }

  ngOnInit() {
    this.projectsApi.find().subscribe(projects => {
      this.projects = projects;
    }, error => console.log(error));
  }

  open(projectId: string): void {
    // this.workstation.openProject(projectViewModel.id);
    this.route.navigate(['/main/' + projectId]);
  }

  onSubmit(): void {

    let project = this.projectService.createProject(this.newProjectName);
    this.projectService.save(project).then(() => {
      this.projects.push(project);
      console.log("projectViewModel saved");
    })
      .catch(error => this.system.error(error));
  }
}
