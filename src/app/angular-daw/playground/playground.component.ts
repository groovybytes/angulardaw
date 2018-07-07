import {Component, OnInit} from '@angular/core';
import {FileService} from "../services/file.service";
import {MetronomeService} from "../services/metronome.service";
import {TransportService} from "../services/transport.service";
import {MidiPlayerService} from "../services/midi-player.service";
import {AudioContextService} from "../services/audiocontext.service";
import {SamplesService} from "../services/samples.service";
import {MidiWriterService} from "../services/midi-writer.service";

declare var sf2;

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  providers: [MetronomeService, TransportService]
})
export class PlaygroundComponent implements OnInit {

  constructor(
    private audioContext: AudioContextService,
    private file:FileService,
    private midiPlayer:MidiPlayerService,
    private midiWriter:MidiWriterService,
    private samplesService: SamplesService) {
  }

  ngOnInit() {
    this.midiWriter.writeProject(null);

  }

  start(): void {

   /* this.file.getFile("assets/midi/songs/bach_846.mid").then(result=>{
      this.midiPlayer.play(result);
    })
*/
    /*this.samplesService.getSamplesForInstrument(InstrumentsEnum.PIANO).then(results=>{
      let instrument = new Instrument();
      instrument.id=InstrumentsEnum.PIANO;
      instrument.samples=results;
      //instrument.play(0,1,"F2");
      instrument.play(0,2, Chords.major("A3"),Dynamics.default());
    })*/
  }

}
