import {Component, Inject, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {PatternsService} from "../../shared/services/patterns.service";
import {Project} from "../../model/daw/Project";
import {Pattern} from "../../model/daw/Pattern";
import {DawInfo} from "../../model/DawInfo";
import {MusicMath} from "../../model/utils/MusicMath";
import {TransportService} from "../../shared/services/transport.service";

@Component({
  selector: 'app-transporttest',
  templateUrl: './transporttest.component.html',
  styleUrls: ['./transporttest.component.scss']
})
export class TransporttestComponent implements OnInit {

  project: Project;
  private pattern: Pattern;


  constructor(
    private projectsService: ProjectsService,
    private session: TransportService,
    @Inject("daw") private daw: DawInfo) {

  }


  ngOnInit() {

   /* this.projectsService.initializeNewProject("tmp", "tmp", ["drumkit1"])
      .then(project => {
        this.bootstrapper.initializeProject(project)
          .then(()=>{
            this.project = project;
            this.daw.project.next(project);

            let track = project.tracks.find(t => t.category === TrackCategory.DEFAULT);
            this.patternService
              .createPatternFromUrl(project, track.id, "patterns/drums/pattern1.json")
              .then(pattern=>{

                this.pattern=pattern;
                this.session = this.project.session;
              })
              .catch(error=>console.error(error));
          })
          .catch(error=>console.error(error));


      })
      .catch(error=>console.error(error));*/
  }

  start(): void {

    this.session.start(
      [this.pattern],
      4,
      true,
      MusicMath.getLoopLength(this.pattern.length,this.daw.project.getValue().settings.bpm.getValue()));
  }

  stop(): void {
    this.session.stop();

  }

  changeBpm(value): void {
    this.project.settings.bpm.next(this.project.settings.bpm.getValue() + value);
  }
}

