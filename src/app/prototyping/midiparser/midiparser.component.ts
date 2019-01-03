import {Component, Inject, OnInit} from '@angular/core';
import {Notes} from "../../model/mip/Notes";
import {ProjectsService} from "../../shared/services/projects.service";
import {Project} from "../../model/daw/Project";
import {DawEvent} from "../../model/daw/DawEvent";
import {DawEventCategory} from "../../model/daw/DawEventCategory";
import {BootstrapperService} from "../../project/bootstrapper.service";
import {DawInfo} from "../../model/DawInfo";
import {MidiBridgeService} from "../../shared/services/midi-bridge.service";
import {ProjectsApi} from "../../api/projects.api";


@Component({
  selector: 'app-midiparser',
  templateUrl: './midiparser.component.html',
  styleUrls: ['./midiparser.component.scss']
})
export class MidiparserComponent implements OnInit {

  file:string="assets/midi/loops/bass/1.mid";
  songFile:string="assets/midi/songs/bach_846.mid";

  project:Project;

  constructor(@Inject("Notes") private notes:Notes,
              private bootstrapper:BootstrapperService,
              private midiBridge:MidiBridgeService,
              private projectsApi:ProjectsApi,
              @Inject("daw") private daw: DawInfo,
              private projectsService:ProjectsService) { }

  ngOnInit() {
    this.projectsService.initializeNewProject("tmp", "tmp", ["piano_1"])
      .then(project => {
        this.bootstrapper.initializeProject(project);
        this.project = project;
        this.daw.project.next(project);
      });
  }

  loadMidi():void{
    this.midiBridge.convertMidi(this.file)
      .then((midi)=>{
        this.project.events.emit(new DawEvent<any>(DawEventCategory.GENERIC,midi));
      })

  }

  convertSong():void{
    this.midiBridge.createTracksFromMidi(this.songFile,this.project)
      .then(()=>{
        let dto = this.projectsService.serializeProject(this.daw.project.getValue());
        debugger;
        console.log("saving");
        this.projectsApi.update(dto)
          .then((result) => {
            console.log("project saved")
          })
          .catch(error => {
            console.error(error);
          });
      })

  }


}
