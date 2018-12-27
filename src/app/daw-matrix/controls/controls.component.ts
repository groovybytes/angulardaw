import {Component, Inject, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {SimpleSliderModel} from "../../model/daw/visual/SimpleSliderModel";
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
  slider: SimpleSliderModel = {
    value: 50,
    options: {
      floor: 40,
      ceil: 240,
      vertical: false,
      hidePointerLabels: true,
      hideLimitLabels: true
    }
  };

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
    let dto = this.projectsService.serializeProject(this.daw.project.getValue());
    console.log("saving");
    this.projectsApi.update(dto)
      .then((result) => {
        console.log("project saved")
      })
      .catch(error => {
        this.system.error(error)
      });

  }

  toggleRecord(): void {
    this.projectsService.toggleRecord(this.daw.project.getValue().selectedPattern.getValue());
  }

  switchMetronome(): void {
    this.daw.project.getValue().metronomeEnabled.next(!this.daw.project.getValue().metronomeEnabled.getValue());
  }

  changeTempo(bpm: SimpleSliderModel): void {
    this.daw.project.getValue().transportSettings.global.bpm = bpm.value;
  }

}
