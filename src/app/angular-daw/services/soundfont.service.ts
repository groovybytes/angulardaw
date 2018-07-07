/*
import {Injectable} from "@angular/core";
import {AudioContextService} from "./audiocontext.service";
import {MidiEvent} from "../model/midi/MidiEvent";
import {MidiFile} from "../model/midi/midifilespec/MidiFile";
import {FileService} from "./file.service";
import {MidiTrack} from "../model/project/MidiTrack";

declare var Soundfont: any;

@Injectable()
export class SoundfontService {

  private piano;

  constructor(private file: FileService, private audioContext: AudioContextService) {
    let ac = this.audioContext.context();
    Soundfont.instrument(ac, 'assets/sounds/fonts/acoustic_grand_piano-mp3.js').then(result => this.piano = result);
  }

  getInstrumentFont(instrument: string, fontId?: string): Promise<any> {
    console.log("trying to find font for " + instrument);
    return new Promise<void>((resolve, reject) => {
      this.file.getFile("assets/cfg/soundfonts.json").then(file => {

        Soundfont.instrument(this.audioContext.context(), instrument, {soundfont: fontId ? fontId : 'MusyngKite'}).then((instrumentFont) => {
          resolve(instrumentFont);
        }).catch(error => {
          console.log("instrument " + instrument + " wasnt found.loading grand piano");
          Soundfont.instrument(this.audioContext.context(), "acoustic_grand_piano", {soundfont: fontId ? fontId : 'MusyngKite'}).then((instrumentFont) => {
            resolve(instrumentFont);
          })


        })


      }).catch(error => reject(error));

    })


  }

  play(instrument: string, events: Array<MidiEvent>): void {
    let ac = this.audioContext.context();
    this.piano.schedule(ac.currentTime, events.map(event => ({time: 0, note: event.midi})));


  }
}
*/
