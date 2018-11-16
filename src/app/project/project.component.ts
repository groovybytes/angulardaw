import {Component, OnDestroy, OnInit} from "@angular/core";
import {Project} from "../model//daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {SimpleSliderModel} from "../model//daw/visual/SimpleSliderModel";
import {ProjectsApi} from "../api/projects.api";
import {System} from "../system/System";
import {WindowSpecs} from "../model/daw/visual/desktop/WindowSpecs";
import {WindowState} from "../model/daw/visual/desktop/WindowState";
import {WindowPosition} from "../model/daw/visual/desktop/WindowPosition";
import {LayoutManagerService} from "../shared/services/layout-manager.service";

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
  WindowState = WindowState;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private layout: LayoutManagerService,
    private projectsService: ProjectsService,
    private projectsApi: ProjectsApi,
    private system: System) {

  }

  close(): void {
    this.router.navigate(['/welcome']);
  }

  toggleSidebar() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      let newProject = JSON.parse(localStorage.getItem("new_project"));
      if (newProject) {
        localStorage.setItem("new_project", null);

        this.projectsService.createProject(params.projectId, newProject.name, newProject.plugins)
          .then(project => {
            let dto = this.projectsService.serializeProject(project);
            dto.id = params.projectId;
            dto.name = dto.id;
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

        this.projectsApi.getById(params.projectId).then(result => {
          this.layout.reset();
          this.projectsService.deSerializeProject(result.data)
            .then(project => {
              this.project = project;
              this.project.ready = true;
            })
            .catch(error => this.system.error(error));
        })
          .catch(error => this.system.error(error));
      }

    });


  }

  getWindow(id:string):WindowSpecs{
    return this.layout.getWindow(id);
  }


  setLayout(layout: number): void {

    this.layout.setLayout(layout);
  }

  getLayout(): number {

    return this.layout.getLayout();
  }

  switchMetronome(): void {
    this.project.metronomeEnabled.next(!this.project.metronomeEnabled.getValue());
  }

  changeTempo(bpm: SimpleSliderModel): void {
    this.project.transportSettings.global.bpm = bpm.value;
  }

  save(): void {
    let dto = this.projectsService.serializeProject(this.project);
    console.log("saving");
    this.projectsApi.update(dto)
      .then((result) => {
        console.log("project saved")
      })
      .catch(error => {
        debugger;
        this.system.error(error)
      });

  }


  togglePlugin(): void {
    /* if (this.project.openedWindows.indexOf("plugin") >= 0) {
       this.slideOut = true;
       setTimeout(() => {
         this.slideOut = false;
         this.project.openedWindows = [];
       }, 700);

     }
     else this.project.openedWindows = ["plugin"];*/

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



