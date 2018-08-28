import {Component, OnInit} from "@angular/core";
import {Project} from "../model/daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {System} from "../../system/System";
import {Options} from 'ng5-slider';

interface SimpleSliderModel {
  value: number;
  options: Options;
}

interface RangeSliderModel {
  minValue: number;
  maxValue: number;
  options: Options;
}


@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  project: Project;
  sideBarOpen: boolean = true;
  slider: SimpleSliderModel = {
    value: 50,
    options: {
      floor: 40,
      ceil: 240,
      vertical: false,
      showSelectionBar: true
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private system: System) {

  }

  close(): void {
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.projectsService.get(params.projectId)
        .then(project => {
          this.project = project;
          this.project.ready = true;
          let bpm = project.transport.getBpm();
         /* project.transport.masterParams.bpm.subscribe(newBpm => {
            if (newBpm !== bpm) {
              this.projectsService.changeTempo(this.project, newBpm,bpm);
              bpm = newBpm;
            }
          })*/
        })
        .catch(error => this.system.error(error));
    });
  }


  switchMetronome(): void {
    this.project.metronomeEnabled = !this.project.metronomeEnabled;
  }

  changeTempo(bpm: any): void {
    this.project.setBpm(bpm.value);
   /* this.projectsService.changeTempo(this.project,bpm.value)
    this.project.setBpm(bpm.value);*/
  }

  closeSequencer(): void {
    this.project.sequencerOpen = false;
  }

  save(): void {
    this.projectsService.save(this.project);
  }

}



