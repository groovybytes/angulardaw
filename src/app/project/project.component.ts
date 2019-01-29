import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Project} from "../model//daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {System} from "../system/System";
import {DawInfo} from "../model/DawInfo";
import {Subscription} from "rxjs";
import {DeviceEvent} from "../model/daw/devices/DeviceEvent";
import {DeviceService} from "./device.service";
import {PushComponent} from "../push/push/push.component";
import {SequencerComponent} from "../sequencer/sequencer.component";
import {DawMatrixComponent} from "../daw-matrix/daw-matrix.component";
import {MidiBridgeService} from "../shared/services/midi-bridge.service";


@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {


  project: Project;


  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private projectsService: ProjectsService,
    @Inject("daw") private daw: DawInfo,
    private midiBridge:MidiBridgeService,
    private system: System) {

  }


  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log("bootstrap");

        this.projectsService.getProject(params.projectId)
          .then(project => {
            setTimeout(()=>{
              // setTimeout: this is important to avoid chrome error with audioengine
              // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
              this.projectsService.initializeProject(project)
                .then(() => {
                  this.project=project;
                  this.subscriptions.push(this.project.deviceEvents2.subscribe((event: DeviceEvent<any>) => {
                    this.deviceService.handleDeviceEvent(event);
                  }));

                  this.daw.ready.next(true);


                  this.daw.project.next(project);
                })
                .catch(error => this.system.error(error));
            })



          })
          .catch(error => this.system.error(error));

    });

  }


  ngOnDestroy(): void {
    this.project.destroy();
    this.subscriptions.forEach(subscr => subscr.unsubscribe());
    this.daw.destroy.emit();

  }

  ngAfterViewInit(): void {


  }


  initializePush(component: PushComponent): void {
    this.deviceService.setupPush(component);
  }

  initializeSequencer(component: SequencerComponent): void {
    component.project = this.project;
  }

  initializeMatrix(component: DawMatrixComponent): void {
    component.project = this.project;
  }

}



