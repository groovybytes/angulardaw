import {Component, Inject, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {MidiBridgeService} from "../../shared/services/midi-bridge.service";
import {PatternsService} from "../../shared/services/patterns.service";
import {TrackCategory} from "../../model/daw/TrackCategory";
import {NoteLength} from "../../model/mip/NoteLength";
import {Project} from "../../model/daw/Project";
import {Pattern} from "../../model/daw/Pattern";
import {Notes} from "../../model/mip/Notes";
import {AudioContextService} from "../../shared/services/audiocontext.service";
import {NoteEvent} from "../../model/mip/NoteEvent";
import {AudioPlugin} from "../../model/daw/plugins/AudioPlugin";
import {SchedulerService} from "../../shared/services/scheduler.service";
import {SamplePlayerService} from "../../shared/services/sample-player.service";
import {PlayerSession} from "../../model/daw/PlayerSession";

@Component({
  selector: 'app-transporttest',
  templateUrl: './transporttest.component.html',
  styleUrls: ['./transporttest.component.scss']
})
export class TransporttestComponent implements OnInit {

  private session: PlayerSession;
   project: Project;
  private pattern: Pattern;
  private plugin: AudioPlugin;

  constructor(
    private projectsService: ProjectsService,
    private audioContext: AudioContextService,
    private patternService: PatternsService,
    private scheduler: SchedulerService,
    private samplePlayerService: SamplePlayerService,
    @Inject("Notes") private notes: Notes,
    private midiBridge: MidiBridgeService) {
  }


  ngOnInit() {
    this.projectsService.initializeNewProject("tmp", "tmp", ["bass_acoustic"])
      .then(project => {
        this.project = project;
        let track = project.tracks.find(t => t.category === TrackCategory.DEFAULT);
        this.midiBridge.convertMidi(project, "assets/midi/loops/bass/1.mid")
          .then(notes => {
            this.pattern = this.patternService.createPattern(project, track.id, NoteLength.Quarter, 8);
            this.plugin = this.pattern.plugin;
            notes.forEach(note => this.pattern.insertNote(note));
          });
      });
  }

  start(): void {

    this.run(this.project, this.pattern.events);
  }

  stop(): void {
    this.session.stop.emit();
  }

  changeBpm(value):void{
    this.project.bpm.next(this.project.bpm.getValue()+value);
  }

  run(project: Project, events: Array<NoteEvent>): void {

    this.session = new PlayerSession(this.plugin, this.samplePlayerService,this.project.bpm);

    this.scheduler.run(this.session, events, this.project.threads.find(t => t.id === "ticker"));
    /*  this.session.play.subscribe((event:{note:string,time:number,length:number})=>{
        this.samplePlayerService.play(this.plugin,event.note,event.time,event.length,this.session);
      });*/

  }
}

