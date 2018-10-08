import {Component, OnDestroy, OnInit} from "@angular/core";
import {Project} from "../shared/model//daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {SimpleSliderModel} from "../shared/model//daw/visual/SimpleSliderModel";
import {ProjectsApi} from "../api/projects.api";
import {System} from "../system/System";

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  project: Project;
  sideBarOpen: boolean = true;
  slideOut: boolean = false;
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
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private projectsApi:ProjectsApi,
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

      let newProject = JSON.parse(localStorage.getItem("new_project"));
      if (newProject) {
        localStorage.setItem("new_project", null);

        this.projectsService.createProject(newProject.name, newProject.plugins)
          .then(project=> {
            let dto = this.projectsService.serializeProject(project);
            dto.id=params.projectId;
            dto.name=dto.id;
            this.projectsApi.create(dto)
              .then(() => {
                this.project = project;
                project.ready = true;
              })
              .catch(error => this.system.error(error));
          })
          .catch(error => this.system.error(error));
      }
      else {

        this.projectsApi.getById(params.projectId).then(dto => {

          this.projectsService.deSerializeProject(dto)
            .then(project => {
              this.project=project;
              this.project.ready = true;
            })
            .catch(error => this.system.error(error));
        })
          .catch(error => this.system.error(error));
      }

    });
  }

  switchMetronome(): void {
    this.project.metronomeEnabled.next(!this.project.metronomeEnabled.getValue());
  }

  changeTempo(bpm: SimpleSliderModel): void {
    this.project.transportSettings.global.bpm = bpm.value;
  }

  save(): void {
    let dto = this.projectsService.serializeProject(this.project);
    this.projectsApi.update(dto)
      .catch(error => this.system.error(error));

  }

  toggleSequencer(): void {
    if (this.project.openedWindows.indexOf("sequencer") >= 0) {
      this.slideOut = true;
      setTimeout(() => {
        this.slideOut = false;
        this.project.openedWindows = [];
      }, 700);

    }
    else this.project.openedWindows = ["sequencer"];

  }

  togglePlugin(): void {
    if (this.project.openedWindows.indexOf("plugin") >= 0) {
      this.slideOut = true;
      setTimeout(() => {
        this.slideOut = false;
        this.project.openedWindows = [];
      }, 700);

    }
    else this.project.openedWindows = ["plugin"];

  }

  ngOnDestroy(): void {
    this.project.destroy();
    /* .then(() => {
       console.log("context destroyed");
     })
     .catch(error => {
       debugger;
       this.system.error(error)
     });*/
  }

}



