import {Injectable} from "@angular/core";
import {NoteInfo} from "../model/utils/NoteInfo";
import {CellInfo} from "./model/CellInfo";
import {Trigger} from "../model/triggers/Trigger";
import {DrumApi} from "../api/drum.api";
import {NoteLength} from "../model/mip/NoteLength";
import {MusicMath} from "../model/utils/MusicMath";
import {TimeSignature} from "../model/mip/TimeSignature";
import {TransportPosition} from "../model/daw/TransportPosition";
import {Loudness} from "../model/mip/Loudness";
import {SequencerEvent} from "./model/SequencerEvent";
import {Track} from "../model/daw/Track";
import {Drums} from "../model/daw/instruments/Drums";
import {EventDTO} from "../shared/api/EventDTO";

@Injectable()
export class StepSequencerService {

  constructor(private drumService: DrumApi) {

  }


  onNoteEventTriggered(
    track: Track,
    newNoteEvent: { note: string, time: number, row: number },
    drumKit: Drums,
    events: Array<SequencerEvent>, play: boolean): void {

    let event = {
      id: null,
      note: newNoteEvent.note,
      time: newNoteEvent.time,
      length: NoteLength.Quarter,
      loudness: Loudness.mf,
      articulation: null
    };

    track.queue.push(event);
    if (play) drumKit.play(newNoteEvent.note);
    events.push(new SequencerEvent(event, newNoteEvent.row));
  }

  onEventClicked(event: SequencerEvent, sequencerEvents: Array<SequencerEvent>, track: Track): void {
    /* let sequencerEventsIndex = sequencerEvents.findIndex(sequencerEvent =>
       sequencerEvent.trackEvent.time === event.trackEvent.time && sequencerEvent.trackEvent.data.name === event.trackEvent.data.name);

     let trackEventsIndex = track.queue.findIndex((_event) =>
       _event.time === event.trackEvent.time && _event.note === event.trackEvent.note);

     if (sequencerEventsIndex >= 0) {
       track.events.splice(trackEventsIndex, 1);
       sequencerEvents.splice(sequencerEventsIndex, 1);
     }*/
  }

  loadInstrument(): Promise<Drums> {
    return this.drumService.getDrums("drumkit1");

  }

  createModel(bars: number, quantization: NoteLength, bpm: number, signature: TimeSignature, events: Array<EventDTO>): Array<CellInfo> {
    let result: Array<CellInfo> = [];
    NoteInfo.notes = {};
    NoteInfo.load();

    let notes = Object.keys(NoteInfo.notes).reverse();
    let ticks = MusicMath.getBarTicks(quantization, signature) * bars;
    let index = 0;
    for (let i = 0; i < ticks * notes.length; i++) {
      let row = Math.floor(i / ticks);
      let note = notes[row];
      let addNote = true;//!triggers || triggers.filter(t => t.test(note)).length > 0;
      if (addNote) {
        let cellInfo = new CellInfo();
        cellInfo.position = new TransportPosition();
        cellInfo.column = index % ticks;

        cellInfo.row = Math.floor(index / ticks);
        cellInfo.note = note;
        cellInfo.position.beat = MusicMath.getBeatNumber(cellInfo.column, quantization, signature);
        result.push(cellInfo);
        index++;
      }
    }
    events.forEach(event => {
      let tick = MusicMath.getTickForTime(event.time, bpm, quantization);
      let cell = result.filter(cell => cell.column === tick && cell.note === event.note)[0];
      cell.active = true;
    })

    return result;
  }
}
