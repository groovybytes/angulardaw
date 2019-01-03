import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Project} from "../model//daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {System} from "../system/System";
import {DockPosition} from "angular2-desktop";
import {DawInfo} from "../model/DawInfo";
import {Subscription} from "rxjs";
import {BootstrapperService} from "./bootstrapper.service";
import {DeviceEvent} from "../model/daw/devices/DeviceEvent";
import {DeviceService} from "./device.service";
import {PushComponent} from "../push/push/push.component";
import {SequencerComponent} from "../sequencer/sequencer.component";
import {DawMatrixComponent} from "../daw-matrix/daw-matrix.component";
import {DawEvent} from "../model/daw/DawEvent";
import {filter} from "rxjs/operators";
import {DawEventCategory} from "../model/daw/DawEventCategory";
import {MidiBridgeService} from "../shared/services/midi-bridge.service";


@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy, AfterViewInit {

  PushComponent = PushComponent;
  DawMatrixComponent = DawMatrixComponent;
  SequencerComponent = SequencerComponent;
  DockPosition = DockPosition;

  project: Project;


  private subscriptions: Array<Subscription> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceService,
    private projectsService: ProjectsService,
    private bootstrapper: BootstrapperService,
    @Inject("daw") private daw: DawInfo,
    private midiBridge:MidiBridgeService,
    private system: System) {

  }


  ngOnInit() {

    this.route.params.subscribe(params => {
      console.log("bootstrap");
      this.bootstrapper.loadProject(params.projectId)
        .then(project => {
          this.project = project;
         /* this.midiBridge.createTracksFromMidi("assets/midi/songs/bach_846.mid",this.project)
            .then(()=>{

            })*/
          this.subscriptions.push(this.project.deviceEvents2.subscribe((event: DeviceEvent<any>) => {
            this.deviceService.handleDeviceEvent(event);
          }));
          this.subscriptions.push(
            this.project.events.pipe(filter(event => event.category === DawEventCategory.TRANSPORT_START))
              .subscribe((event: DawEvent<any>) => {

              }));
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



