import {Component, OnInit} from '@angular/core';
import {Project} from "../model/daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {System} from "../system/System";
import {ProjectsService} from "../shared/services/projects.service";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService:ProjectsService,
    private system:System) {

  }

  close(): void {
    this.project.destroy();
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectService.loadProject(params.projectId)
        .then(project=>this.project=project)
        .catch(error=>this.system.error(error));
    });
  }
}



