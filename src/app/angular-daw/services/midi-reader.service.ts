import {Injectable} from "@angular/core";
import {MidiEvent} from "../model/midi/MidiEvent";
import {Subject} from "rxjs/internal/Subject";
import {MidiFile} from "../model/midi/midifilespec/MidiFile";


@Injectable()
export class MidiReaderService {

  midiEvent: Subject<MidiEvent> = new Subject<MidiEvent>();

  read(midi:MidiFile):void{


  }
}

/*writeSomeMidi() {

  var track = new MidiWriterService.Track();

// Define an instrument (optional):
  //track.addEvent(new MidiWriterService.ProgramChangeEvent({instrument: 1}));
// Add some notes:
  var note = new MidiWriterService.NoteEvent({pitch: ['E4', 'E4', 'E4'], duration: '1'});
  track.addEvent(note);

// Generate a data URI
  var write = new MidiWriterService.Writer([track]);
  console.log(write.dataUri());

  let self = this;
  MIDI.loadPlugin({
    soundfontUrl: "./assets/sounds/fonts/",
    instrument: "acoustic_grand_piano",
    onprogress: function (state, progress) {

    },
    onsuccess: function () {

      let player = MIDI.Player;

      player.timeWarp = 1; // speed the song is played back
      player.loadFile(write.dataUri(), player.start);
      /// control the piano keys colors
      player.addListener(function (data) {

      });

    }
  })

}*/
