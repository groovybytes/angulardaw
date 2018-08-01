import {Component, OnInit} from '@angular/core';
import {WorkstationService} from "./shared/services/workstation.service";
import {Transport} from "./model/daw/Transport";
import {ActivatedRoute} from "@angular/router";
import {Project} from "./model/daw/Project";
import {ProjectsApi} from "./shared/api/projects.api";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  workstation: WorkstationService;
  transport: Transport;

  constructor(
    workstation: WorkstationService) {
    this.workstation = workstation;
    this.transport = new Transport(()=>workstation.audioContext.currentTime);

  }

  ngOnInit() {


  }

}


