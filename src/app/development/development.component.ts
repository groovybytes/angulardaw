import {Component, Inject, Input} from '@angular/core';
import {InstrumentInfoApi} from "../api/instrumentinfo.api";
import {SamplesApi} from "../api/samples.api";
import {DrumApi} from "../api/drum.api";
import {AppConfiguration} from "../app.configuration";
import {System} from "../system/System";
import {Project} from "../model/daw/Project";
import {MidiTrack} from "../model/daw/MidiTrack";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {ProjectDto} from "../shared/api/ProjectDTO";

@Component({
  selector: 'app-development',
  templateUrl: './development.component.html',
  styleUrls: ['./development.component.scss']
})
export class DevelopmentComponent {

  @Input() project: Project;

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext,
    private config: AppConfiguration,
    private drumService: DrumApi,
    private instrumentsInfoApi: InstrumentInfoApi,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    private system: System,
    @Inject("lodash") private _,
    private samplesV2Service: SamplesApi) {
  }


  private go(): void {
        let track = this.project.tracks[0] as MidiTrack;
        this.project.transportParams.tickStart = 0;
        this.project.transportParams.tickEnd = 3;
        this.project.transportParams.loop = true;
        track.addNote("C1", 0, 1, 1);
        track.addNote("D1", 500, 1, 1);
        track.addNote("C1", 1000, 1, 1);
  }

  ngOnInit(): void {
    this.go()

  }

  start(): void {

  }

  stop(): void {

  }


  getInstrumentAndPlayChord(): void {
    /*  this.samplesService.getSamplesForInstrument(InstrumentsEnum.PIANO).then(results => {
        let instrument = new Instrument();
        instrument.id = InstrumentsEnum.PIANO;
        instrument.samples = results;
        //instrument.play(0,1,"F2");
        instrument.play(0, 2, Chords.major("A2"), Dynamics.default());
      });*/
  }

  /*playBachPiano(): void {
    this.file.getFile("assets/midi/songs/bach_846.mid").then(result => {
      this.midiPlayer.play(result);
    })
  }

  loadDrumKitandTriggerBassDrum(): void {
    this.drumService.getDrumKit("drumkit1")
      .then(drumkit => {
        this.drumService.getMapping("bfd2.mapping")
          .then(mapping => {
            drumkit.loadMapping(mapping);
            drumkit.context.trigger.next("C1")
          })
          .catch(error => this.system.error(error));
      })
      .catch(error => this.system.httpError(error));
  }*/


}
