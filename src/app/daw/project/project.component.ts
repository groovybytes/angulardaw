import {Component, OnInit} from "@angular/core";
import {Project} from "../model/daw/Project";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectsService} from "../shared/services/projects.service";
import {System} from "../../system/System";


@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  project: Project;
  sideBarOpen: boolean = true;

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
        .then(project=>{
          this.project = project;
          this.project.ready=true;
         /* let bpm = this.transportService.params.bpm.getValue();
          this.transportService.params.bpm.subscribe(newBpm => {
            if (newBpm !== bpm) {
              let factor = bpm / newBpm;
              bpm = newBpm;
              /!*this.project.model.tracks.forEach(track => track.patterns.forEach(pattern => {
                pattern.events.forEach(event => event.time = event.time * factor);
              }));*!/
            }
          })*/
        })
        .catch( error => this.system.error(error));
    });
  }


  switchMetronome():void{
    this.project.metronomeEnabled=! this.project.metronomeEnabled;
  }

  closeSequencer():void{
    this.project.sequencerOpen=false;
  }

  save(): void {
    this.projectsService.save(this.project);
  }

}



