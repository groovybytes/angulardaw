import {EventEmitter, Inject, Injectable} from '@angular/core';
import {AudioPlugin} from "../../model/daw/plugins/AudioPlugin";
import {Notes} from "../../model/mip/Notes";
import {PlayerSession} from "../../model/daw/session/PlayerSession";
import {SamplePlayer} from "../../model/daw/session/SamplePlayer";

@Injectable({
  providedIn: 'root'
})
export class SamplePlayerService implements SamplePlayer {

  constructor(@Inject("Notes") private notes: Notes) {
  }

  play(plugin: AudioPlugin, note: string, time: number, length: number, session: PlayerSession): void {

    let detune = 0;
    let node: AudioBufferSourceNode;
    let sample = plugin.getSample(note);
    if (sample.baseNote) detune = this.notes.getInterval(sample.baseNote, this.notes.getNote(note)) * 100;
    sample.trigger(time, length, null, detune)
      .then(_node => {
        node = _node;
      });

    let stopSubscription = session.stop.subscribe(() => {
      stopSubscription.unsubscribe();
      if (node) node.stop(0);
    });

  }

}
