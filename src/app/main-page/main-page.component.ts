import {Component, OnInit} from '@angular/core';
import {Transport} from "../model/daw/Transport";
import {Project} from "../model/daw/Project";
import {WorkstationService} from "../shared/services/workstation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MainPageService} from "./main-page.service";
import {System} from "../system/System";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  workstation: WorkstationService;
  transport: Transport;
  project: Project;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service:MainPageService,
    private system:System,
    workstation: WorkstationService) {


    this.workstation = workstation;
    this.transport = new Transport(() => workstation.audioContext.currentTime);

  }

  close(): void {
    this.project.destroy();
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.loadProject(params.projectId,this.transport)
        .then(project=>this.project=project)
        .catch(error=>this.system.error(error));
    });
  }
}



