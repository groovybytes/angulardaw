import {Injectable} from "@angular/core";
import {NoteInfo} from "../model/utils/NoteInfo";
import {CellInfo} from "./model/CellInfo";
import {Trigger} from "../model/triggers/Trigger";
import {DrumApi} from "../api/drum.api";
import {Drumkit} from "../model/mip/drums/classes/Drumkit";
import {DrumSample} from "../model/mip/drums/classes/DrumSample";
import {NoteLength} from "../model/mip/NoteLength";
import {MusicMath} from "../model/utils/MusicMath";
import {TimeSignature} from "../model/mip/TimeSignature";
import {TransportPosition} from "../model/daw/TransportPosition";
import {TrackEvent} from "../model/daw/TrackEvent";
import {Note} from "../model/mip/Note";
import {Loudness} from "../model/mip/Loudness";
import {SequencerEvent} from "./model/SequencerEvent";
import {Track} from "../model/daw/Track";
import {DrumTrackEventHandler} from "../model/daw/DrumTrackEventHandler";

@Injectable()
export class StepSequencerService {

  constructor(private drumService: DrumApi) {

  }


  onNoteEventTriggered(
    track: Track<DrumTrackEventHandler>,
    newNoteEvent: { note: string, time: number, row: number },
    drumKit: Drumkit,
    events: Array<SequencerEvent>,play:boolean): void {

    let newEvent = new TrackEvent<Note>(newNoteEvent.time, new Note(newNoteEvent.note, NoteLength.Quarter, Loudness.mf, 0));
    track.addEvent(newEvent);
    if (play) drumKit.context.trigger.next(newEvent.data.name);
    events.push(new SequencerEvent(newEvent, newNoteEvent.row));
  }

  onEventClicked(event: SequencerEvent, sequencerEvents: Array<SequencerEvent>, track: Track<DrumTrackEventHandler>): void {
    let sequencerEventsIndex = sequencerEvents.findIndex(sequencerEvent =>
      sequencerEvent.trackEvent.time === event.trackEvent.time && sequencerEvent.trackEvent.data.name === event.trackEvent.data.name);

    let trackEventsIndex = track.events.findIndex((_event: TrackEvent<Note>) =>
      _event.time === event.trackEvent.time && _event.data.name === event.trackEvent.data.name);

    if (sequencerEventsIndex >= 0) {
      track.events.splice(trackEventsIndex, 1);
      sequencerEvents.splice(sequencerEventsIndex, 1);
    }
  }

  loadInstrument(): Promise<Drumkit> {
    return new Promise((resolve, reject) => {
      this.drumService.getDrumKit("drumkit1").then(drumkit => {
        this.drumService.getMapping("bfd2.mapping")
          .then(mapping => {
            drumkit.loadMapping(mapping);
            resolve(drumkit);
          }).catch(error => reject(error));

      }).catch(error => reject(error));
    })
  }

  createModel(bars: number, quantization: NoteLength, bpm: number, signature: TimeSignature, events: Array<TrackEvent<Note>>, triggers?: Array<Trigger<string, DrumSample>>): Array<CellInfo> {
    let result: Array<CellInfo> = [];
    NoteInfo.notes = {};
    NoteInfo.load();

    let notes = Object.keys(NoteInfo.notes).reverse();
    let ticks = MusicMath.getBarTicks(quantization, signature) * bars;
    let index = 0;
    for (let i = 0; i < ticks * notes.length; i++) {
      let row = Math.floor(i / ticks);
      let note = notes[row];
      let addNote = !triggers || triggers.filter(t => t.test(note)).length > 0;
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
      let cell = result.filter(cell => cell.column === tick && cell.note === event.data.name)[0];
      cell.active = true;
    })

    return result;
  }
}
