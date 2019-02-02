import {Component, Inject, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {DawInfo} from "../../model/DawInfo";
import {ProjectsApi} from "../../api/projects.api";
import {Router} from "@angular/router";
import {System} from "../../system/System";

@Component({
  selector: 'daw-matrix-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {


  daw:DawInfo;

  constructor(
    private projectsService:ProjectsService,
    private projectsApi:ProjectsApi,
    private router: Router,
    private system: System,
    @Inject("daw")  daw:DawInfo) {
    this.daw=daw;
  }

  ngOnInit() {
  }


  close(): void {
    this.router.navigate(['/welcome']);
  }



  save(): void {
    let dto = this.projectsService.saveProject(this.daw.project.getValue())
      .then(() => {
        alert("project saved")
      })
      .catch(error => {
        this.system.error(error)
      });

  }

  toggleRecord(): void {
    //this.projectsService.toggleRecord();
  }

  switchMetronome(): void {
    this.daw.project.getValue().settings.metronomeSettings.enabled.next(!this.daw.project.getValue().settings.metronomeSettings.enabled.getValue());
  }

  changeTempo(bpm): void {
   // this.daw.project.getValue().settings.bpm.next(bpm.value);
  }

}
