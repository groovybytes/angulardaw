import {Component, Inject, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {PatternsService} from "../../shared/services/patterns.service";
import {TrackCategory} from "../../model/daw/TrackCategory";
import {Project} from "../../model/daw/Project";
import {Pattern} from "../../model/daw/Pattern";
import {TransportSession} from "../../model/daw/session/TransportSession";
import {DawInfo} from "../../model/DawInfo";
import {MusicMath} from "../../model/utils/MusicMath";
import {BootstrapperService} from "../../project/bootstrapper.service";

@Component({
  selector: 'app-transporttest',
  templateUrl: './transporttest.component.html',
  styleUrls: ['./transporttest.component.scss']
})
export class TransporttestComponent implements OnInit {

  private session: TransportSession;
  project: Project;
  private pattern: Pattern;


  constructor(
    private projectsService: ProjectsService,
    private bootstrapper:BootstrapperService,
    @Inject("daw") private daw: DawInfo,
    private patternService: PatternsService) {

  }


  ngOnInit() {

    this.projectsService.initializeNewProject("tmp", "tmp", ["drumkit1"])
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
      .catch(error=>console.error(error));
  }

  start(): void {

    this.session.start(
      [this.pattern],
      4,
      true,
      MusicMath.getLoopLength(this.pattern.length,this.daw.project.getValue().bpm.getValue()),this.daw.project.getValue().settings.metronomeSettings);
  }

  stop(): void {
    this.session.stop();

  }

  changeBpm(value): void {
    this.project.bpm.next(this.project.bpm.getValue() + value);
  }
}

