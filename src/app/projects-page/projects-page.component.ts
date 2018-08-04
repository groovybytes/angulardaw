import {Component, Inject, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {Router} from "@angular/router";
import {System} from "../system/System";
import {AuthService} from "../shared/services/auth.service";
import {ProjectDto} from "../shared/api/ProjectDTO";
import {TrackCategory} from "../model/daw/TrackCategory";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectMapper} from "../shared/api/mapping/ProjectMapper";

@Component({
  selector: 'projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  newProjectName: string;
  projects: Array<ProjectDto> = [];


  constructor(
    private route: Router,
    private system: System,
    private auth: AuthService,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>) {

  }

  ngOnInit() {
    this.projectsApi.find().subscribe(projects => {
      this.projects = projects;
    }, error => console.log(error));
  }

  open(project: Project): void {
    // this.workstation.openProject(project.id);
    this.route.navigate(['/main/' + project.id]);
  }

  onSubmit(): void {
    let project = new Project();
    project.userId = this.auth.getUserId();
    project.name = this.newProjectName;
    this.projectsApi.post(ProjectMapper.toJSON(project)).subscribe(project => {
      this.projects.push(project);
      console.log("project saved");
    }, error => this.system.error(JSON.stringify(error)));
  }
}
