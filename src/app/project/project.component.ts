import {AfterViewInit, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {Project} from "../model//daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {SimpleSliderModel} from "../model//daw/visual/SimpleSliderModel";
import {ProjectsApi} from "../api/projects.api";
import {System} from "../system/System";
import {DockPosition, WindowState} from "angular2-desktop";
import {DawInfo} from "../model/DawInfo";
import {Subscription} from "rxjs";
import {BootstrapperService} from "./bootstrapper.service";


@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('pads') pads: TemplateRef<any>;
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
  DockPosition = DockPosition;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private bootstrapper:BootstrapperService,
    private projectsApi: ProjectsApi,
    @Inject("daw") private daw: DawInfo,
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

                this.daw.project.next(project);
                //!todo this.layout.reset();
                //!todo this.layout.applyLayout();
                project.ready = true;
              })
              .catch(error => this.system.error(error));
          })
          .catch(error => this.system.error(error));
      } else {

        this.projectsApi.getById(params.projectId).then(result => {
          this.projectsService.deSerializeProject(result.data)
            .then(project => {
              this.project = project;
              this.daw.project.next(project);
              this.project.ready = true;
              console.log("ready");
            })
            .catch(error => this.system.error(error));
        })
          .catch(error => this.system.error(error));
      }

    });


  }

//!todo t
  /*getWindow(id:string):WindowInfo{
    return this.layout.getWindowInfo(id);
  }*/

  setLayout(layout): void {

  }

  getLayout(): string {

    return "";
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
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
    /* .then(() => {
       console.log("context destroyed");
     })
     .catch(error => {
       debugger;
       this.system.error(error)
     });*/
  }


  ngAfterViewInit(): void {
    this.bootstrapper.setupDesktop();

  }

}



