import {Inject, Injectable} from "@angular/core";
import {Project} from "../../model/daw/Project";
import {Track} from "../../model/daw/Track";
import {Pattern} from "../../model/daw/Pattern";
import {NoteTrigger} from "../../model/daw/NoteTrigger";
import * as _ from "lodash";
import {Transport} from "../../model/daw/transport/Transport";
import {TransportParams} from "../../model/daw/transport/TransportParams";
import {NoteLength} from "../../model/mip/NoteLength";
import {MasterTransportParams} from "../../model/daw/transport/MasterTransportParams";
import {MusicMath} from "../../model/utils/MusicMath";

@Injectable()
export class TracksService {

  constructor(
    @Inject("AudioContext") private audioContext: AudioContext
  ) {

  }

  /* create(projectViewModel:Project):Promise<Pattern>{
     return new Promise((resolve,reject)=>{
       let pattern = new Pattern();
       this.patternApi.post(pattern).subscribe(pattern=>{
         projectViewModel.patterns.push(pattern);
         resolve(pattern);
       },error=>reject(error));
     })



   }*/


  createMetronomeEvents(metronomeTrack: Track): Array<NoteTrigger> {
    let pattern = new Pattern([]);
    let tickTime = MusicMath.getTickTime(metronomeTrack.transport.getBpm(), metronomeTrack.transport.getQuantization());
    let beatTicks = MusicMath.getBeatTicks(metronomeTrack.transport.getQuantization());
    let beatTime = tickTime * beatTicks;
    let beatUnit = metronomeTrack.transport.getSignature().beatUnit;
    let events = [];
    for (let i = 0; i < 100; i++) {
      events.push(new NoteTrigger(null, i % beatUnit === 0 ? "A0" : "", i * beatTime));
    }

    return events;
  }

  resetEventsWithPattern(track: Track, patternId: string): void {
    let pattern = track.patterns.find(p => p.id === patternId);
    track.transport.params.loopEnd.next(pattern.length);
    track.transport.params.loop.next(true);
    track.resetEvents(pattern.events);

  }


  addPattern(track: Track): Pattern {

    let pattern = new Pattern(track.plugin.getNotes().reverse());
    pattern.id = this.guid();

    track.patterns.push(pattern);
    /* let row = entry.top / cellHeight;
     let column = entry.left / cellWidth;
     entry.data = new GridCellViewModel(null, row, column, pattern.id);*/

    return pattern;
  }

  createDefaultTrack(master: Transport): Track {
    let transport = new Transport(this.audioContext, new TransportParams(
      NoteLength.Quarter,
      0,
      1000,
      true
    ), master.masterParams);

    return new Track(this.guid(), this.audioContext, master, transport);
  }

  addTrack(project: Project): Track {
    let track = this.createDefaultTrack(project.transport);
    track.name = "track name";
    project.tracks.push(track);
    return track;
  }

  toggleSolo(project: Project, track: Track): void {
    track.controlParameters.solo.next(!track.controlParameters.solo.getValue());
    let isSolo = track.controlParameters.solo.getValue();
    if (isSolo) track.controlParameters.mute.next(false);
    project.tracks.forEach(_track => {
      if (_track.id !== track.id) {
        if (_track.controlParameters.solo.getValue() === true) _track.controlParameters.solo.next(false);
        _track.controlParameters.mute.next(isSolo);
      }
    });
  }

  insertNote(pattern: Pattern, note: NoteTrigger): void {
    note.id = this.guid();
    let index = _.sortedIndexBy(pattern.events, {'time': note.time}, d => d.time);
    pattern.events.splice(index, 0, note);
  }

  removeNote(pattern: Pattern, id: string): void {
    let index = pattern.events.findIndex(ev => ev.id === id);
    pattern.events.splice(index, 1);
  }

  private guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
